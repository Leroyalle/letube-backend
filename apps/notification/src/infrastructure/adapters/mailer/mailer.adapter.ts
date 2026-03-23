import { SendMessageDto } from '@contracts/notification';
import { MailerService } from '@nestjs-modules/mailer';
import type { MailerAdapterPort } from 'apps/notification/src/application/ports/mailer-adapter.port';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerAdapter implements MailerAdapterPort {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendMessage(dto: SendMessageDto) {
    try {
      for (const to of dto.to) {
        await this.mailerService.sendMail({
          to,
          from: this.configService.getOrThrow<string>('MAIL_USER'),
          subject: dto.subject,
          text: dto.message,
          html: '<b>welcome</b>',
        });
      }
    } catch (error) {
      console.log('NotificationService_sendMessage', error);
      throw error;
    }
  }
}
