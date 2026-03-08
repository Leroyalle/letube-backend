import { IsEnum, IsUUID } from 'class-validator';

import { ContentType } from '../enums/content-type.enum';

export class UploadCompleteDto {
  @IsUUID()
  sourceId!: string;

  @IsEnum(ContentType)
  contentType!: ContentType;
}
