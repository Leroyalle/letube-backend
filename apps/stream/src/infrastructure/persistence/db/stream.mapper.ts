import { Stream as DomainStream } from 'apps/stream/src/domain/entities/stream.entity';

import type { Stream as PrismaStream } from '../../../../__generated__/prisma';

const statusMap: Record<string, DomainStream['props']['status']> = {
  REQUESTED: 'REQUESTED',
  PUBLISHED: 'PUBLISHED',
  ERROR: 'ERROR',
  STOPPED: 'STOPPED',
};

export class StreamMapper {
  public static toPersistence(data: DomainStream): PrismaStream {
    return {
      id: data.props.id,
      channelId: data.props.channelId,
      streamKey: data.props.streamKey,
      status: data.props.status,
      playlistPath: data.props.playlistPath,
      segmentsPath: data.props.segmentsPath,
    };
  }

  public static toDomain(data: PrismaStream): DomainStream {
    return new DomainStream({
      id: data.id,
      channelId: data.channelId,
      streamKey: data.streamKey,
      playlistPath: data.playlistPath,
      segmentsPath: data.segmentsPath,
      status: statusMap[data.status] || 'ERROR',
    });
  }
}
