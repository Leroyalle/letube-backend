import { RabbitMQModule } from '@app/infra-core';
import { S3Module } from '@app/infra-core/s3/s3.module';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { handlers } from './application/handlers/handlers';
import { BROKER_EVENT_BUS_TOKEN, VIDEO_REPOSITORY_TOKEN } from './application/ports/tokens';
import { RabbitMQEventBus } from './infrastructure/broker/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { PrismaVideoRepository } from './infrastructure/persistence/db/prisma-video.repository';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { MediaMessagingController } from './presentation/messaging/media.messaging.controller';

@Module({
  imports: [
    PrismaModule,
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'media', '.env'),
    }),
    RabbitMQModule.registerAsync(rabbitMQConfig),
    S3Module,
  ],
  controllers: [MediaMessagingController],
  providers: [
    {
      provide: VIDEO_REPOSITORY_TOKEN,
      useClass: PrismaVideoRepository,
    },
    {
      provide: BROKER_EVENT_BUS_TOKEN,
      useClass: RabbitMQEventBus,
    },
    ...handlers,
  ],
})
export class MediaModule {}
