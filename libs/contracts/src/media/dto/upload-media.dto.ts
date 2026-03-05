import { IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  fileName!: string;

  @IsString()
  contentType!: string;
}
