import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Reservation } from 'src/features/reservation/entities/reservation.entity';

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

  @ManyToOne(() => Reservation, (reservation) => reservation.categories)
  reservationId: Relation<Reservation>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
