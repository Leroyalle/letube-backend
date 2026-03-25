import type { ClockPort } from '@app/abstractions/system/time/clock.port';
import { CLOCK_TOKEN } from '@app/abstractions/system/time/clock.token';
import { Message } from 'apps/chat/src/domain/entities/message.entity';
import { randomUUID } from 'crypto';

import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, type ICommandHandler } from '@nestjs/cqrs';

import { SendMessageCommand } from '../commands/send-message.command';
import { MessageCreatedEvent } from '../events/message-created.event';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject(CLOCK_TOKEN) private readonly clockService: ClockPort,
  ) {}

  public async execute(command: SendMessageCommand) {
    const message = Message.create({
      id: randomUUID(),
      content: command.props.content,
      receiverId: command.props.receiverId,
      senderId: command.props.senderId,
      createdAt: this.clockService.now(),
    });

    const snapshot = message.snapshot();

    this.eventBus.publish(
      new MessageCreatedEvent({
        id: snapshot.id,
        content: snapshot.content,
        receiverId: snapshot.receiverId,
        senderId: snapshot.senderId,
        createdAt: snapshot.createdAt,
      }),
    );
    return Promise.resolve();
  }
}
