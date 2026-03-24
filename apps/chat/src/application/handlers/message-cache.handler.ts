import { CACHE_TOKEN } from '@app/abstractions/cache/cache.token';
import type { ClockPort } from '@app/abstractions/system/time/clock.port';
import { CLOCK_TOKEN } from '@app/abstractions/system/time/clock.token';

import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { MessageCreatedEvent } from '../events/message-created.event';
import type { CacheManagerPort } from '../ports/cache-manager.port';

@EventsHandler(MessageCreatedEvent)
export class MessageCacheHandler implements IEventHandler<MessageCreatedEvent> {
  constructor(
    @Inject(CACHE_TOKEN) private readonly cacheManager: CacheManagerPort,
    @Inject(CLOCK_TOKEN) private readonly clockService: ClockPort,
  ) {}

  public async handle(event: MessageCreatedEvent) {
    const key = `${event.props.receiverId}`;

    await this.cacheManager.zadd(
      key,
      this.clockService.nowMs(),
      JSON.stringify({
        id: event.props.id,
        content: event.props.content,
        receiverId: event.props.receiverId,
        senderId: event.props.senderId,
      }),
    );

    await this.cacheManager.zremrangebyrank(key, 0, -101);

    await this.cacheManager.expire(key, 3600);
  }
}
