import { Message } from 'apps/chat/src/domain/entities/message.entity';
import { randomUUID } from 'crypto';

import { CommandHandler, type EventBus, type ICommandHandler } from '@nestjs/cqrs';

import { SendMessageCommand } from '../commands/send-message.command';
import { MessageCreatedEvent } from '../events/message-created.event';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(private readonly eventBus: EventBus) {}

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
