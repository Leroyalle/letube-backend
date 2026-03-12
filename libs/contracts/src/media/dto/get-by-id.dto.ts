import { IsUUID } from 'class-validator';

export class GetByIdDto {
  @IsUUID()
  id!: string;
}
