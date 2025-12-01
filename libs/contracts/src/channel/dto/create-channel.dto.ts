import { IsString, IsUUID } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  userId: string;
}
