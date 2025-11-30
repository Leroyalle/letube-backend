import { IsString } from 'class-validator';

export class VerifyAccessTokenDto {
  @IsString()
  token: string;
}
