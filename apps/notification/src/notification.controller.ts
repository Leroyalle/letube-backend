import { NOTIFICATION_PATTERNS, SendMessageDto } from '@contracts/notification';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(NOTIFICATION_PATTERNS.SEND_MESSAGE)
  public sendMessage(@Payload() dto: SendMessageDto) {
    return this.notificationService.sendMessage(dto);
  }
}
