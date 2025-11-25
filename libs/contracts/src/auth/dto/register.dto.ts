import { IsString, MaxLength, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2, { message: 'Name should to has most symbols' })
  @MaxLength(15, { message: 'Name should to has less letters' })
  name: string;
}
