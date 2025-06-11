import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CategoryService } from '../category/category.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { Reservation } from './entities/reservation.entity';
import { RoomsService } from '../rooms/rooms.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { StateRoom } from 'src/common/enums/state-room.enum';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    private readonly roomsService: RoomsService,
    private readonly categoryService: CategoryService,
    private readonly clientService: ClientsService,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create(createReservationDto: CreateReservationDto) {
    const { roomId, categoryId, arrivalDate, departureDate, clientId } =
      createReservationDto;

    await this.clientService.findOne(clientId.toString());

    const room = await this.roomsService.findOne(roomId);
    const category = await this.categoryService.findOne(categoryId);

    // Validación: fechas solapadas
    const overlappingReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoin('reservation.rooms', 'room')
      .where('room.id = :roomId', { roomId })
      .andWhere('reservation.arrivalDate <= :departureDate', { departureDate })
      .andWhere('reservation.departureDate >= :arrivalDate', { arrivalDate })
      .getCount();

    if (overlappingReservations > 0) {
      throw new BadRequestException(
        `Ya existe una reserva para esta habitación en el rango de fechas seleccionado.`,
      );
    }

    try {
      // Opcional: solo marcar como ocupada si la reserva incluye la fecha actual
      const now = new Date();
      const isCurrentlyReserved =
        new Date(arrivalDate) <= now &&
        (departureDate ? new Date(departureDate) >= now : true);

      if (isCurrentlyReserved) {
        room.state = StateRoom.OCCUPIED;
        await this.roomsService.update(room.id, { state: room.state });
      }

      const reservation = this.reservationRepository.create({
        ...createReservationDto,
        rooms: [room],
        categories: [category],
      });

      const savedReservation =
        await this.reservationRepository.save(reservation);

      return savedReservation;
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    const where: FindOptionsWhere<Reservation> = {};

    if (term) {
      where.rooms = ILike(`%${term}%`);
      where.categories = ILike(`%${term}%`);
    }

    return await this.paginationService.paginate(this.reservationRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof Reservation,
      where,
      relations: ['rooms', 'categories'],
    });
  }

  async findOne(id: string) {
    return `This action returns a #${id} reservation`;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  async remove(id: string) {
    return `This action removes a #${id} reservation`;
  }
}
