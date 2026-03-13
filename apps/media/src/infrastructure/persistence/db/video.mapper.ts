import type { Video as PrismaVideo } from '../../../../__generated__/prisma';
import type { Video as DomainVideo } from '../../../domain/entities/video.entity';

const statusMap: Record<string, DomainVideo['props']['status']> = {
  UPLOADED: 'UPLOADED',
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
      hlsMasterKey: video.hlsMasterKey,
      status: statusMap[video.status] || 'ERROR',
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
}
