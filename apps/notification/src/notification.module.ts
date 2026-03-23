import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { MAILER_ADAPTER_TOKEN } from './application/ports/tokens';
import { MailerAdapter } from './infrastructure/adapters/mailer/mailer.adapter';
import { mailerConfig } from './infrastructure/adapters/mailer/mailer.config';
import { NotificationCommandsController } from './presentation/commands/notification.commands.controller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'notification', '.env'),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationCommandsController],
  providers: [{ provide: MAILER_ADAPTER_TOKEN, useClass: MailerAdapter }],
})
export class NotificationModule {}
