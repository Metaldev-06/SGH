import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { checkUserPermission } from 'src/common/helpers/checkUserPermission.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { HashPassword } from 'src/common/helpers/hashPassword.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { Role } from 'src/common/enums/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create({ password, role, ...createUserDto }: CreateUserDto) {
    const esxistUserAdmin = await this.findOneByRole(role as Role);

    console.log(esxistUserAdmin);

    if (esxistUserAdmin?.role === role) {
      throw new BadRequestException(`Action denied`);
    }

    const hash = await HashPassword(password);

    const user = this.usersRepository.create({
      password: hash,
      role,
      ...createUserDto,
    });

    try {
      const userCreated = await this.usersRepository.save(user);
      return userCreated;
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    const where: FindOptionsWhere<User> = {};

    if (term) {
      where.firstName = ILike(`%${term}%`);
      where.lastName = ILike(`%${term}%`);
    }

    return await this.paginationService.paginate(this.usersRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof User,
      where,
    });
  }

  async findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto, userReq: User) {
    const targetUser = await this.findOne(id);

    if (!targetUser)
      throw new BadRequestException(`User with id ${id} not found`);

    checkUserPermission(targetUser, userReq);

    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new BadRequestException(`User with id ${id} not found`);

    return this.usersRepository.save(user);
  }

  async remove(id: string, userReq: User) {
    const user = await this.findOne(id);

    if (!user) throw new BadRequestException(`User with id ${id} not found`);

    checkUserPermission(user, userReq);

    if (!user) throw new BadRequestException(`User with id ${id} not found`);

    await this.usersRepository.softRemove(user);

    return {
      message: 'User deleted successfully',
      statusCode: 200,
    };
  }

  async findOneByRole(role: Role) {
    const user = await this.usersRepository.findOneBy({ role });

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    return user;
  }
}
