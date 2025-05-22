import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Role } from 'src/common/enums/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@Auth(Role.MANAGER)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.usersService.remove(id, user);
  }
}
