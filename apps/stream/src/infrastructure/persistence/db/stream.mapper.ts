import { Stream as DomainStream } from 'apps/stream/src/domain/entities/stream.entity';

import type { Stream as PrismaStream } from '../../../../__generated__/prisma';

export class StreamMapper {
  public toPersistence(data: DomainStream): PrismaStream {
    return {
      id: data.props.id,
      channelId: data.props.channelId,
      streamKey: data.props.streamKey,
      status: data.props.status,
    };
  }

  public toDomain(data: PrismaStream): DomainStream {
    return new DomainStream({
      id: data.id,
      channelId: data.channelId,
      streamKey: data.streamKey,
      status: data.status,
    });
  }
}
