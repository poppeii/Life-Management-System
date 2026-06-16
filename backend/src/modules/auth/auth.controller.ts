import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto, RequestPasswordResetDto, ResetPasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: RequestPasswordResetDto) {
    return this.auth.requestPasswordReset(dto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@CurrentUser() user: AuthUser) {
    return this.auth.logout(user.sub);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.sub);
  }
}
