import { JwtRefreshPayload } from '@app/commons/jwtAuth/auth.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserIdAndRefreshToken = createParamDecorator(
  (data: keyof JwtRefreshPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;

    return request.user[data];
  },
);