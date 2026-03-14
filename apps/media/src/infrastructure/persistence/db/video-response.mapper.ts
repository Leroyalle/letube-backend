import type { Video as PrismaVideo } from 'apps/media/__generated__/prisma';
import type { VideoResponseDto } from 'apps/media/src/application/dto/video-response.dto';

export class VideoResponseMapper {
  public static toDto(data: PrismaVideo): VideoResponseDto {
    return {
      visibility: data.visibility,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
      bucket: data.bucket,
      hlsMasterKey: data.hlsMasterKey,
      sourceKey: data.sourceKey,
      status: data.status,
      id: data.id,
      name: data.name,
      description: data.description,
      channelId: data.channelId,
    };
  }
}
