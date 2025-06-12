import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { StateReservation } from 'src/common/enums/state-reservation.enum';
import { Category } from 'src/features/category/entities/category.entity';
import { Client } from 'src/features/clients/entities/client.entity';
import { Room } from 'src/features/rooms/entities/room.entity';

export class CreateReservationDto {
  @IsInt()
  @Max(99999999)
  @Min(0)
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsDateString()
  arrivalDate: Date;

  @IsDateString()
  @IsOptional()
  departureDate?: Date;

  @IsUUID()
  clientId: Client;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @Max(999)
  roomId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @Max(999)
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsIn(Object.values(StateReservation))
  state?: StateReservation;

  @IsInt()
  @IsOptional()
  @Max(99999999)
  @Min(0)
  @IsPositive()
  advancePayment?: number;
}
