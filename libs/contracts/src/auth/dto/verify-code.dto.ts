import { IsEmail, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  code: string;

  @IsEmail()
  email: string;
}
