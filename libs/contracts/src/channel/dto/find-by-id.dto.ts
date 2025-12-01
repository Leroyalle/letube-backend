import { IsUUID } from 'class-validator';

export class FindByIdDto {
  @IsUUID()
  id: string;
}
