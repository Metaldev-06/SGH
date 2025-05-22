import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    nullable: false,
  })
  tel: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('boolean', {
    default: false,
  })
  partnerAca: boolean;

  @Column('text', {
    nullable: false,
  })
  arrivalDate: Date;

  @Column('text', {
    nullable: true,
  })
  departureDate: Date;
}
