import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';

import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { MessageCreatedEvent } from '../events/message-created.event';
import type { BrokerEventBusPort } from '../ports/broker-event-bus.port';
import { BROKER_EVENT_BUS_TOKEN } from '../ports/tokens';

@EventsHandler(MessageCreatedEvent)
export class MessageRealtimeHandler implements IEventHandler<MessageCreatedEvent> {
  constructor(
    @Inject(BROKER_EVENT_BUS_TOKEN) private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public handle(event: MessageCreatedEvent) {
    this.brokerEventBus.emit(CHAT_PATTERNS.MESSAGE_CREATED, {
      id: event.props.id,
      content: event.props.content,
      receiverId: event.props.receiverId,
      senderId: event.props.senderId,
      createdAt: event.props.createdAt,
    });
  }
}
