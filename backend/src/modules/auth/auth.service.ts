import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly logs: ActivityLogsService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email is already registered');
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email.toLowerCase(), passwordHash: await argon2.hash(dto.password) }
    });
    await this.logs.create({ userId: user.id, action: 'USER_REGISTERED', entityType: 'USER', entityId: user.id, description: `${user.name} registered` });
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email.toLowerCase(), deletedAt: null } });
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) throw new UnauthorizedException('Invalid email or password');
    await this.logs.create({ userId: user.id, action: 'USER_LOGGED_IN', entityType: 'USER', entityId: user.id, description: `${user.name} logged in` });
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get<string>('JWT_REFRESH_SECRET') }).catch(() => null);
    if (!payload?.sub) throw new UnauthorizedException('Invalid refresh token');
    const stored = await this.prisma.refreshToken.findFirst({ where: { userId: payload.sub, revokedAt: null } });
    if (!stored || !(await argon2.verify(stored.tokenHash, refreshToken)) || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return this.safeUser(user);
  }

  private async issueTokens(user: { id: string; email: string; role: string; name: string; avatarUrl?: string | null }) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN') ?? '15m'
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') ?? '7d'
    });
    await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: await argon2.hash(refreshToken), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });
    return { user: this.safeUser(user), accessToken, refreshToken };
  }

  private safeUser(user: { id: string; name: string; email: string; role: string; avatarUrl?: string | null }) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl };
  }
}
