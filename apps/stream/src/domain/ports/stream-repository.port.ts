import type { Stream } from '../entities/stream.entity';

export interface StreamRepositoryPort {
  create(data: Stream): Promise<void>;
  delete(id: string): Promise<void>;
  update(data: Stream): Promise<void>;
  findByChannelId(channelId: string): Promise<string | null>;
}
