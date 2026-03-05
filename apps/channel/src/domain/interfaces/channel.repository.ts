import type { Channel } from '../entities/channel.entity';

export interface ChannelRepository {
  create: (data: Channel) => Promise<Channel>;
  remove: (id: string) => Promise<Channel>;
  findByUserId: (userId: string) => Promise<Channel | null>;
  findAll: () => Promise<Channel[]>;
  findById: (id: string) => Promise<Channel | null>;
}
