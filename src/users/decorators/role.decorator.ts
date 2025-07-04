import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../enum/users.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (UserRoles | string)[]) =>
  SetMetadata(ROLES_KEY, roles);
