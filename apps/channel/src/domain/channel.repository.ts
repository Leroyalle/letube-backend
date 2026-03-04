import type { Channel } from './entities/channel.entity';

export interface ChannelRepository {
  create: (data: Channel) => Promise<Channel>;
  remove: (id: string) => Promise<Channel>;
}
