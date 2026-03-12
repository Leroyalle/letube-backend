import { IsEnum, IsString } from 'class-validator';

import { ContentType } from '../enums/content-type.enum';

export class MediaProcessedDto {
  @IsString()
  sourceId!: string;
  @IsEnum(ContentType)
  contentType!: ContentType;
  @IsString()
  hlsMasterKey!: string;
}
