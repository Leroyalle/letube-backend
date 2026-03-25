import { IsString, IsUUID } from 'class-validator';

export class MessageDto {
  @IsString()
  content!: string;

  @IsUUID()
  receiverId!: string;
}
