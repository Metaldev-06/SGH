import { BadRequestException, Injectable } from '@nestjs/common';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/user-role.enum';
import { ComparePassword } from 'src/common/helpers/hashPassword.helper';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async createAdmin(createAuthDto: RegisterAuthDto) {
    const user = await this.userService.create({
      ...createAuthDto,
      role: Role.ADMIN,
    });

    if (!user) throw new BadRequestException('User not created');

    return {
      token: this.getJwtToken({
        email: user.email,
        role: user.role,
      }),
      user,
    };
  }

  async login({ email, password }: LoginAuthDto) {
    const user = await this.userService.findOneByEmail(email);

    await ComparePassword(password, user.password);

    return {
      token: this.getJwtToken({ email, role: user.role }),
      user,
    };
  }

  async checkAdmin() {
    const existUserAdmin = await this.userService.findOneByRole(Role.ADMIN);

    if (existUserAdmin) {
      return true;
    }

    return false;
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
