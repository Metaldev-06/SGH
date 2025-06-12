import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from 'src/features/category/entities/category.entity';
import { Client } from 'src/features/clients/entities/client.entity';
import { Exclude } from 'class-transformer';
import { Room } from 'src/features/rooms/entities/room.entity';
import { StateReservation } from 'src/common/enums/state-reservation.enum';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', {
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column('text', {
    nullable: false,
  })
  arrivalDate: Date;

  @Column('text', {
    nullable: true,
  })
  departureDate: Date;

  @ManyToOne(() => Client, (client) => client.reservations, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  clientId: Relation<Client>;

  @OneToMany(() => Room, (room) => room.reservationId, {
    onDelete: 'CASCADE',
    eager: true,
  })
  rooms: Relation<Room[]>;

  @OneToMany(() => Category, (category) => category.reservationId, {
    eager: true,
    onDelete: 'CASCADE',
  })
  categories: Relation<Category[]>;

  @Column('boolean', {
    default: false,
  })
  paid: boolean;

  @Column('text', {
    default: StateReservation.PENDING,
  })
  state: StateReservation;

  @Column('numeric', {
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0,
  })
  advancePayment: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
