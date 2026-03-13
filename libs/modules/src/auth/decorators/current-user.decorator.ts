import type { UserDto } from '@contracts/user';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserDecorator = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserDto | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserDto | undefined;
  },
);
