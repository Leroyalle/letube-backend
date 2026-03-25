import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';
import type { SendMessageRpcContract } from '@contracts/chat/rpc/send-message.rpc';

import { Controller } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';

import { SendMessageCommand } from '../../application/commands/send-message.command';

@Controller()
export class ChatEventsController {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(CHAT_PATTERNS.MESSAGE_CREATED)
  public messageCreated(data: SendMessageRpcContract) {
    return this.eventBus.publish(
      new SendMessageCommand({
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
      }),
    );
  }
}
