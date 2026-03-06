import { IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  filename!: string;

  @IsString()
  contentType!: string;
}
