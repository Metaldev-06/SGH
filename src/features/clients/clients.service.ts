import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create(createClientDto: CreateClientDto) {
    try {
      const newClient = this.clientRepository.create(createClientDto);
      await this.clientRepository.save(newClient);
      return newClient;
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    const where: FindOptionsWhere<Client> = {};

    if (term) {
      where.name = ILike(`%${term}%`);
      where.dni = ILike(`%${term}%`);
      where.address = ILike(`%${term}%`);
      where.city = ILike(`%${term}%`);
      where.state = ILike(`%${term}%`);
      where.tel = ILike(`%${term}%`);
      where.email = ILike(`%${term}%`);
    }

    return await this.paginationService.paginate(this.clientRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof Client,
      where,
    });
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client)
      throw new BadRequestException(`Client with ID ${id} not found`);

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client)
      throw new BadRequestException(`Client with ID ${id} not found`);

    try {
      await this.clientRepository.save(client);
      return client;
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async remove(id: string) {
    const client = await this.findOne(id);

    await this.clientRepository.softRemove(client);

    return {
      message: `Client deleted successfully`,
      statusCode: 200,
    };
  }
}
