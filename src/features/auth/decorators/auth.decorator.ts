import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Role } from 'src/common/enums/user-role.enum';
import { Roles } from './system-roles.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(role: Role) {
  return applyDecorators(
    Roles(role),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
