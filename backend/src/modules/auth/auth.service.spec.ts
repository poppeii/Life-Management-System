import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma: any = {
    user: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
    refreshToken: { create: jest.fn() }
  };
  const jwt: any = { signAsync: jest.fn().mockResolvedValue('token') };
  const config: any = { get: jest.fn((key: string) => key) };
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
});
