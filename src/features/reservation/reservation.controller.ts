import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ReservationService } from './reservation.service';
import { Role } from 'src/common/enums/user-role.enum';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
@Auth(Role.EMPLOYEE)
@UseInterceptors(ClassSerializerInterceptor)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reservationService.findAll(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.remove(id);
  }
}
