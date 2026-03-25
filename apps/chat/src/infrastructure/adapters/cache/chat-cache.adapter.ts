import type {
  CachedMessage,
  ChatCacheAdapterPort,
} from 'apps/chat/src/application/ports/chat-cache-adapter.port';
import type { Message } from 'apps/chat/src/domain/entities/message.entity';

import { Injectable } from '@nestjs/common';

import type { RedisAdapter } from '../redis/redis.adapter';

import { MessageCacheMapper } from './chat-cache.mapper';

@Injectable()
export class ChatCacheAdapter implements ChatCacheAdapterPort {
  constructor(private readonly redis: RedisAdapter) {}

  private buildUserFeedKey(receiverId: string): string {
    return `chat:${receiverId}`;
  }

  public async addMessage(receiverId: string, message: Message) {
    const key = this.buildUserFeedKey(receiverId);

    const cache = MessageCacheMapper.toCache(message);

    await this.redis.zadd(key, cache.createdAt, JSON.stringify(cache));
    await this.redis.zremrangebyrank(key, 0, -101);
    await this.redis.expire(key, 3600);
  }

  public async findMessages(receiverId: string): Promise<CachedMessage[]> {
    const key = this.buildUserFeedKey(receiverId);

    const messages = await this.redis.zrevrange(key, 0, -1);

    return messages.map(message => MessageCacheMapper.fromCache(message));
  }
}
