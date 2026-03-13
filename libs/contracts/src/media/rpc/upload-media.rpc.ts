import { ContentType } from '../enums/content-type.enum';

export interface UploadMediaRpc {
  name: string;
  description: string;
  userId: string;
  filename: string;
  contentType: ContentType;
}
