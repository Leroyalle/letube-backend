import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';
import type { MessageCreatedResponseDto } from '@contracts/chat/responses/message-created-response.dto';

import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { ChatEmitter } from '../../infrastructure/transport/ws/chat.emitter';

@Controller()
export class ChatEventsController {
  constructor(private readonly chatEmitter: ChatEmitter) {}

  @EventPattern(CHAT_PATTERNS.MESSAGE_CREATED)
  public handleMessageCreated(payload: MessageCreatedResponseDto) {
    this.chatEmitter.emitNewMessage(payload.receiverId, payload);
  }
}
