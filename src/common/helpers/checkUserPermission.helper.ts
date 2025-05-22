import { UnauthorizedException } from '@nestjs/common';

import { Role } from '../enums/user-role.enum';
import { User } from 'src/features/users/entities/user.entity';

export function checkUserPermission(paramUser: User, reqUser: User) {
  const roleHierarchy = {
    [Role.ADMIN]: 3,
    [Role.MANAGER]: 2,
    [Role.EMPLOYEE]: 1,
  };

  // Solo Admin y Manager pueden editar/eliminar su propio usuario
  if (paramUser.id === reqUser.id) {
    if (reqUser.role === Role.ADMIN || reqUser.role === Role.MANAGER) return;
    throw new UnauthorizedException(
      'Only Admins and Managers can modify/delete their own user',
    );
  }

  if (reqUser.role === Role.ADMIN) return;

  if (reqUser.role === Role.MANAGER) {
    if (roleHierarchy[paramUser.role] >= roleHierarchy[Role.MANAGER]) {
      throw new UnauthorizedException(
        'Managers cannot modify/delete Admins or other Managers',
      );
    }
    return;
  }

  // Employees no pueden modificar/eliminar ningún usuario (ni a sí mismos)
  throw new UnauthorizedException(
    'You do not have permission to perform this action',
  );
}
