import { NOTIFICATION_PATTERNS, SendMessageDto } from '@contracts/notification';

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { SendMessageCommand } from '../../application/commands/send-message.command';

@Controller()
export class NotificationCommandsController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(NOTIFICATION_PATTERNS.SEND_MESSAGE)
  public sendMessage(@Payload() dto: SendMessageDto) {
    return this.commandBus.execute(
      new SendMessageCommand({
        message: dto.message,
        subject: dto.subject,
        to: dto.to,
        type: dto.type,
      }),
    );
  }
}
