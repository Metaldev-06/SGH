import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Room } from 'src/features/rooms/entities/room.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  name: string;

  @Column('numeric', {
    nullable: false,
    precision: 10,
    scale: 2,
  })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
