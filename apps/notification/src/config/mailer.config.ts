import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

export const mailerConfig = (
  configService: ConfigService,
): Promise<MailerOptions> | MailerOptions => {
  return {
    transport: {
      host: configService.getOrThrow<string>('MAIL_HOST'),
      port: configService.getOrThrow<number>('MAIL_PORT'),
      auth: {
        user: configService.getOrThrow<string>('MAIL_USER'),
        pass: configService.getOrThrow<string>('MAIL_PASS'),
      },
      secure: configService.getOrThrow<boolean>('MAIL_SECURE'),
    },
    defaults: {
      from: `"Letube" <${configService.get<string>('MAIL_USER')}>`,
    },
    template: {
      dir: __dirname + '/templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
