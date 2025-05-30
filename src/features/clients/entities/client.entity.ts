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
import { Reservation } from 'src/features/reservation/entities/reservation.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  dni: string;

  @Column('text', {
    nullable: true,
  })
  address: string;

  @Column('text', {
    nullable: true,
  })
  city: string;

  @Column('text', {
    nullable: true,
  })
  state: string;

  @Column('text', {
    nullable: false,
  })
  tel: string;

  @Column('text', {
    nullable: true,
    unique: true,
  })
  email: string;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  partnerAca: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.clientId, {
    cascade: true,
  })
  reservations: Relation<Reservation[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
