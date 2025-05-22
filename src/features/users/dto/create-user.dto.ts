import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @MinLength(3)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @MinLength(3)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  @IsIn([Role.ADMIN, Role.MANAGER, Role.EMPLOYEE])
  role?: Role;
}
