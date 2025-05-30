import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    const where: FindOptionsWhere<Category> = {};

    if (term) {
      where.name = ILike(`%${term}%`);
    }

    return await this.paginationService.paginate(this.categoryRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof Category,
      where,
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category)
      throw new BadRequestException(`Category with id ${id} not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    await this.categoryRepository.softRemove(category);

    return {
      message: 'Category deleted successfully',
      statusCode: 200,
    };
  }
}
