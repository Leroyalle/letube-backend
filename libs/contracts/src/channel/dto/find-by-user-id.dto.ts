import { IsUUID } from 'class-validator';

export class FindByUserIdDto {
  @IsUUID()
  userId: string;
}
