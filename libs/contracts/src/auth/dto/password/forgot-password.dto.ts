import { IsEmail, IsString, Max, Min } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Min(6)
  @Max(20)
  password!: string;
}
