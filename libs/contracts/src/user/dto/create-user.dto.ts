import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EUserRole } from '../enums';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;
  @IsString({ message: 'Invalid name' })
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(20, { message: 'Name is too long' })
  name: string;
  @MinLength(6, { message: 'Password is too short' })
  @MaxLength(20, { message: 'Password is too long' })
  password: string;
  @IsOptional()
  @IsEnum(EUserRole, { message: 'Invalid role' })
  role?: EUserRole;
  @IsBoolean({ message: 'Invalid isBanned' })
  isBanned?: boolean;
  @IsBoolean({ message: 'Invalid isVerified' })
  isVerified: boolean;
}
