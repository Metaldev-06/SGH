import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Role } from 'src/common/enums/user-role.enum';
import { RoomsService } from './rooms.service';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
@Auth(Role.MANAGER)
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.roomsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
