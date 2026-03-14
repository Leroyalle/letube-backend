import { IsEnum, IsString } from 'class-validator';

import { ContentType } from '../enums/content-type.enum';
import { Visibility } from '../enums/visibility.enum';

export class UploadMediaDto {
  @IsString()
  name!: string;
  @IsString()
  description!: string;
  @IsString()
  filename!: string;
  @IsEnum(ContentType)
  contentType!: ContentType;
  @IsEnum(Visibility)
  visibility!: Visibility;
}
