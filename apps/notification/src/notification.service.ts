import { SendMessageDto } from '@contracts';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendMessage(
    dto: SendMessageDto,
  ): Promise<{ status: 'success' | 'error' }> {
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
      return { status: 'success' };
    } catch (error) {
      console.log('NotificationService_sendMessage', error);
      return { status: 'error' };
    }
  }
}
