import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { envs } from 'src/config/envs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/features/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ email }: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Credentials are not valid');

    return user;
  }
}
