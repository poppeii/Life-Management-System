import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUser = { sub: string; email: string; role: 'USER' | 'ADMIN'; name: string };

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  return ctx.switchToHttp().getRequest().user;
});
