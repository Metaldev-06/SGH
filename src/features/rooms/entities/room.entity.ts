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
import { StateRoom } from 'src/common/enums/state-room.enum';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  numberRoom: string;

  @Column('numeric', {
    nullable: false,
  })
  capacity: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    nullable: false,
    default: StateRoom.AVAILABLE,
  })
  state: StateRoom;

  @ManyToOne(() => Reservation, (reservation) => reservation.rooms)
  reservationId: Relation<Reservation>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
