import type { Stream } from '../entities/stream.entity';

export interface StreamRepositoryPort {
  create(data: Stream): Promise<Stream>;
  delete(id: string): Promise<void>;
  update(data: Stream): Promise<void>;
  findByChannelId(channelId: string): Promise<Stream | null>;
  findByStreamKey(streamKey: string): Promise<Stream | null>;
}
