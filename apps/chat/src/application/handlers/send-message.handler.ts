import { CACHE_TOKEN } from '@app/abstractions/cache/cache.token';
import { Message } from 'apps/chat/src/domain/entities/message.entity';
import { randomUUID } from 'crypto';

import { Inject } from '@nestjs/common';
import { CommandHandler, type EventBus, type ICommandHandler } from '@nestjs/cqrs';

import { SendMessageCommand } from '../commands/send-message.command';
import { MessageCreatedEvent } from '../events/message-created.event';
import type { BrokerEventBusPort } from '../ports/broker-event-bus.port';
import type { CacheManagerPort } from '../ports/cache-manager.port';
import { BROKER_EVENT_BUS_TOKEN } from '../ports/tokens';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(
    @Inject(CACHE_TOKEN) private readonly cacheManager: CacheManagerPort,
    private readonly eventBus: EventBus,
    @Inject(BROKER_EVENT_BUS_TOKEN) private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: SendMessageCommand) {
    const message = Message.create({
      id: randomUUID(),
      content: command.props.content,
      receiverId: command.props.receiverId,
      senderId: command.props.senderId,
    });

    this.eventBus.publish(
      new MessageCreatedEvent({
        id: message.props.id,
        content: message.props.content,
        receiverId: message.props.receiverId,
        senderId: message.props.senderId,
      }),
    );
    return Promise.resolve();
  }
}
