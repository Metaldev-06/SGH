import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
