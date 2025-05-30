import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { StateRoom } from 'src/common/enums/state-room.enum';
import { Category } from 'src/features/category/entities/category.entity';

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

  @ManyToOne(() => Category, (category) => category.rooms, {})
  categoryId: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
