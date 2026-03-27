import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';
import type { SendMessageRpcContract } from '@contracts/chat/rpc/send-message.rpc';

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';

import { SendMessageCommand } from '../../application/commands/send-message.command';

@Controller()
export class ChatEventsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(CHAT_PATTERNS.MESSAGE_CREATE)
  public messageCreated(data: SendMessageRpcContract) {
    return this.commandBus.execute(
      new SendMessageCommand({
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
      }),
    );
  }
}
