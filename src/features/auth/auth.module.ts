import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { envs } from 'src/config/envs';
import { JwtStrategy } from './strategies/jwt.strategies';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: envs.jwtSecret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, PaginationService],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
