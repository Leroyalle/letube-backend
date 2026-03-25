import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { Message } from '../../domain/entities/message.entity';
import { MessageCreatedEvent } from '../events/message-created.event';
import type { ChatCacheAdapterPort } from '../ports/chat-cache-adapter.port';
import { CHAT_CACHE_ADAPTER_TOKEN } from '../ports/tokens';

@EventsHandler(MessageCreatedEvent)
export class MessageCacheHandler implements IEventHandler<MessageCreatedEvent> {
  constructor(
    @Inject(CHAT_CACHE_ADAPTER_TOKEN) private readonly chatCacheAdapter: ChatCacheAdapterPort,
  ) {}

  public async handle(event: MessageCreatedEvent) {
    const message = Message.rehydrate(event.props);
    await this.chatCacheAdapter.addMessage(event.props.receiverId, message);
  }
}
