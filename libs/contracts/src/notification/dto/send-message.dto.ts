import { IsArray, IsIn, IsString } from 'class-validator';

const notificationType = ['AUTH', 'NOTIFICATION'] as const;

export class SendMessageDto {
  @IsArray()
  @IsString({ each: true })
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsIn(notificationType)
  type: (typeof notificationType)[number];
}
