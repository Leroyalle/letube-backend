import { IsUUID } from 'class-validator';

export class FindByIdsDto {
  @IsUUID()
  ids!: string[];
}
