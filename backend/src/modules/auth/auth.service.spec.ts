import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma: any = {
    user: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
    refreshToken: { create: jest.fn(), updateMany: jest.fn() },
    passwordResetToken: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), updateMany: jest.fn() }
  };
  const jwt: any = { signAsync: jest.fn().mockResolvedValue('token') };
  const config: any = { get: jest.fn((key: string) => ({ FRONTEND_URL: 'http://localhost:3000', NODE_ENV: 'test' })[key]) };
  const logs: any = { create: jest.fn() };
  const service = new AuthService(prisma, jwt, config, logs);

  beforeEach(() => jest.clearAllMocks());

  it('rejects duplicate registration email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    await expect(service.register({ name: 'Pat', email: 'pat@test.dev', password: 'Password123' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects login when user is missing', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    await expect(service.login({ email: 'none@test.dev', password: 'Password123' })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('creates a password reset token without revealing whether an email exists', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'u1', email: 'pat@test.dev', name: 'Pat' });
    prisma.passwordResetToken.create.mockResolvedValue({ id: 'reset1' });

    const result = await service.requestPasswordReset({ email: 'pat@test.dev' });

    expect(result.ok).toBe(true);
    expect(result.resetUrl).toContain('/reset-password?token=');
    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ userId: 'u1', tokenHash: expect.any(String), expiresAt: expect.any(Date) })
    }));
  });

  it('updates the password and consumes a valid reset token', async () => {
    prisma.passwordResetToken.findMany.mockResolvedValue([{
      id: 'reset1',
      userId: 'u1',
      tokenHash: await import('argon2').then((argon2) => argon2.hash('valid-token')),
      expiresAt: new Date(Date.now() + 60_000),
      usedAt: null
    }]);
    prisma.user = { ...prisma.user, update: jest.fn().mockResolvedValue({ id: 'u1' }) };

    await expect(service.resetPassword({ token: 'valid-token', password: 'NewPassword1!' })).resolves.toEqual({ ok: true });

    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { passwordHash: expect.any(String) } });
    expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({ where: { id: 'reset1' }, data: { usedAt: expect.any(Date) } });
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({ where: { userId: 'u1', revokedAt: null }, data: { revokedAt: expect.any(Date) } });
  });
});
