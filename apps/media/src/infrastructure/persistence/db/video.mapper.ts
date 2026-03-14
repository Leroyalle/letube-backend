import type { CreateVideoRecord } from 'apps/media/src/application/ports/video-repository.port';
import { Visibility } from 'apps/media/src/domain/value-objects/visibility.vo';

import type { Prisma, Video as PrismaVideo } from '../../../../__generated__/prisma';
import { Video as DomainVideo } from '../../../domain/entities/video.entity';

const statusMap: Record<string, DomainVideo['props']['status']> = {
  UPLOADED: 'UPLOADED',
  UPLOADING: 'UPLOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

type SharedVideoKeys = keyof Prisma.VideoCreateInput & keyof DomainVideo['props'];
type PersistenceRecord = Pick<Prisma.VideoCreateInput, SharedVideoKeys>;

export class VideoMapper {
  public static toDomain(video: PrismaVideo): DomainVideo {
    return new DomainVideo({
      id: video.id,
      name: video.name,
      description: video.description,
      channelId: video.channelId,
      visibility: Visibility.from(video.visibility),
      sourceKey: video.sourceKey,
      hlsMasterKey: video.hlsMasterKey,
      status: statusMap[video.status] || 'ERROR',
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    });
  }

  public static toCreatePersistence(data: CreateVideoRecord): Prisma.VideoCreateInput {
    return {
      id: data.video.props.id,
      name: data.video.props.name,
      description: data.video.props.description,
      channelId: data.video.props.channelId,
      sourceKey: data.video.props.sourceKey,
      hlsMasterKey: data.video.props.hlsMasterKey,
      status: data.video.props.status,
      visibility: data.video.props.visibility.getValue(),
      bucket: data.storage.bucket,
    };
  }

  public static toPersistenceUpdateData(video: DomainVideo): PersistenceRecord {
    return {
      id: video.props.id,
      name: video.props.name,
      description: video.props.description,
      channelId: video.props.channelId,
      sourceKey: video.props.sourceKey,
      hlsMasterKey: video.props.hlsMasterKey,
      status: video.props.status,
      visibility: video.props.visibility.getValue(),
    };
  }
}
