import { SetMetadata } from '@nestjs/common';
import { Enums } from 'src/utils';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Enums.RoleType[]) =>
  SetMetadata(ROLES_KEY, roles);
