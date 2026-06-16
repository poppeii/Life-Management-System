import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'Password must include an uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must include a lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must include a number' })
  @Matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, { message: 'Password must include a special character' })
  password: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

export class RefreshDto {
  @IsString() refreshToken: string;
}

export class RequestPasswordResetDto {
  @IsEmail() email: string;
}

export class ResetPasswordDto {
  @IsString() token: string;
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'Password must include an uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must include a lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must include a number' })
  @Matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, { message: 'Password must include a special character' })
  password: string;
}
