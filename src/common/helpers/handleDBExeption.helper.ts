import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerHelper } from './logger.helper';
import { QueryFailedError } from 'typeorm';

export const HandleDBExceptions = (error: any, ctx: string): never => {
  if (error.code === '23505') throw new BadRequestException(error.detail);

  // Verifica si el error es un QueryFailedError (usado por TypeORM)
  if (error instanceof QueryFailedError) {
    // Maneja el caso específico de SQLite para restricciones únicas
    if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
      throw new BadRequestException('El valor ya existe en la base de datos');
    }
  }

  LoggerHelper(error, ctx, true);

  throw new InternalServerErrorException(
    'Error inesperado, verifica los logs del servidor',
  );
};
