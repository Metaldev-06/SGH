import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { Room } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomsController],
  providers: [RoomsService, PaginationService],
})
export class RoomsModule {}
