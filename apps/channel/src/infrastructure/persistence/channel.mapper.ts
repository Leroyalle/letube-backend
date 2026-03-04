import type {
  Prisma,
  Channel as PrismaChannel,
} from 'apps/channel/__generated__/prisma';
import { Channel as DomainChannel } from '../../domain/entities/channel.entity';

export class ChannelMapper {
  public static toDomain(data: PrismaChannel): DomainChannel {
    return new DomainChannel(data.id, data.userId, data.name, data.description);
  }

  public static toPersistence(data: DomainChannel): Prisma.ChannelCreateInput {
    return {
      description: data.description,
      id: data.id,
      name: data.name,
      userId: data.userId,
    };
  }
}
