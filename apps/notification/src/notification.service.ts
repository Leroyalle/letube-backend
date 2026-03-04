import { SendMessageDto } from '@contracts/notification';
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
          to: 'Toaster-11@yandex.ru',
          from: this.configService.getOrThrow<string>('MAIL_USER'),
          subject: dto.subject,
          text: dto.message,
          html: `<b> ${dto.message} </b>`,
        });
      }
      return { status: 'success' };
    } catch (error) {
      console.log('NotificationService_sendMessage', error);
      throw error;
    }
  }
}
