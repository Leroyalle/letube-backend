// export interface VideoResponseDto {
//   id: string;
//   name: string;
//   sourceKey: string;
//   previewUrl: string | null;
//   createdAt: Date;
//   durationMs: number;
//   views: number;

//   channel: {
//     id: string;
//     name: string;
//     avatarUrl: string | null;
//   };
// }

export interface VideoResponseDto {
  id: string;

  name: string;
  description: string;
  durationMs: number;
  channelId: string;
  visibility: string;
  views: number;

  bucket: string;
  sourceKey: string;
  hlsMasterKey: string | null;
  previewKey: string | null;

  status: string;

  createdAt: Date;
  updatedAt: Date;
}
