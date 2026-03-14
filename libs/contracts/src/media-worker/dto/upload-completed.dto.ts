import { ContentType } from '@contracts/media/enums/content-type.enum';
import { Visibility } from '@contracts/media/enums/visibility.enum';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class UploadCompletedDto {
  @IsString()
  sourceKey!: string;

  @IsUUID()
  sourceId!: string;

  @IsEnum(ContentType)
  contentType!: ContentType;

  @IsEnum(Visibility)
  visibility!: Visibility;
}
