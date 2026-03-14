export interface VideoResponseDto {
  id: string;
  name: string;
  description: string;
  channelId: string;
  visibility: string;
  sourceKey: string;
  hlsMasterKey: string | null;
  status: string;
  bucket: string;
  createdAt: Date;
  updatedAt: Date;
}
