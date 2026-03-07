import type { Video as DomainVideo } from 'apps/media/src/domain/entities/video.entity';

import type { Video as PrismaVideo } from '../../../../__generated__/prisma';

const statusMap: Record<string, DomainVideo['props']['status']> = {
  UPLOADING: 'UPLOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export class VideoMapper {
  public static toDomain(video: PrismaVideo): DomainVideo['props'] {
    return {
      id: video.id,
      name: video.name,
      description: video.description,
      channelId: video.channelId,
      sourceKey: video.sourceKey,
      status: statusMap[video.status] || 'ERROR',
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
}
