import { EUserRole } from '@contracts/user';

import { applyDecorators, CustomDecorator, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

import { RolesDecorator } from './roles.decorator';

export function Authorization(...roles: EUserRole[]) {
  const decorators: CustomDecorator | MethodDecorator[] = [UseGuards(AuthGuard)];

  if (roles.length > 0) decorators.push(RolesDecorator(...roles), UseGuards(RolesGuard));

  return applyDecorators(...decorators);
}
