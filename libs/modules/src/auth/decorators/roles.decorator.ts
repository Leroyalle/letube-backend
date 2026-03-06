import { EUserRole } from '@contracts/user';

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';
export const RolesDecorator = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
