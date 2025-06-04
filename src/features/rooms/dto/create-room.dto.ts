import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { StateRoom } from 'src/common/enums/state-room.enum';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @Transform(({ value }) => value.trim())
  numberRoom: string;

  @IsNotEmpty()
  @IsInt()
  @Max(10)
  @Min(1)
  capacity: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @IsIn(Object.values(StateRoom))
  @Transform(({ value }) => value.trim())
  state: StateRoom;
}
