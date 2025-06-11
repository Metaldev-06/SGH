import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { Client } from '../clients/entities/client.entity';
import { ClientsService } from '../clients/clients.service';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { Reservation } from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Room } from '../rooms/entities/room.entity';
import { RoomsService } from '../rooms/rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, Category, Client])],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    PaginationService,
    RoomsService,
    CategoryService,
    ClientsService,
  ],
})
export class ReservationModule {}
