import { IsString, MaxLength, MinLength } from 'class-validator';

import { VerifyCodeDto } from '../verify-code.dto';

export class ResetPasswordDto extends VerifyCodeDto {
  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  @MaxLength(20, { message: 'Password is too long' })
  password: string;
}
