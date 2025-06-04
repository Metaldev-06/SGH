import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CreateRoomDto } from './dto/create-room.dto';
import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { Room } from './entities/room.entity';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room = this.roomRepository.create(createRoomDto);
      return await this.roomRepository.save(room);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    const where: FindOptionsWhere<Room> = {};

    if (term) {
      where.numberRoom = ILike(`%${term}%`);
    }

    return await this.paginationService.paginate(this.roomRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof Room,
      where,
    });
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) throw new BadRequestException(`Room with ID ${id} not found`);

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({
      id,
      ...updateRoomDto,
    });

    if (!room) throw new BadRequestException(`Room with ID ${id} not found`);

    try {
      return await this.roomRepository.save(room);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async remove(id: number) {
    const room = await this.findOne(id);

    await this.roomRepository.softRemove(room);

    return {
      message: 'Room deleted successfully',
      statusCode: 200,
    };
  }
}
