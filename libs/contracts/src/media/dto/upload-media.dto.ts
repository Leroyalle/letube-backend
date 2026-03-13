import { IsEnum, IsString } from 'class-validator';

import { ContentType } from '../enums/content-type.enum';

export class UploadMediaDto {
  @IsString()
  name!: string;
  @IsString()
  description!: string;
  @IsString()
  filename!: string;
  @IsEnum(ContentType)
  contentType!: ContentType;
}
