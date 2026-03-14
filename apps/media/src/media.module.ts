import { RabbitMQModule } from '@app/infra-core';
import { S3Module } from '@app/infra-core/s3/s3.module';
import { CHANNEL_HOST, CHANNEL_PORT, CHANNEL_SERVICE } from '@infra';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { handlers } from './application/handlers/handlers';
import {
  BROKER_EVENT_BUS_TOKEN,
  CHANNEL_ADAPTER_TOKEN,
  VIDEO_REPOSITORY_READ_TOKEN,
  VIDEO_REPOSITORY_TOKEN,
} from './application/ports/tokens';
import { RabbitMQEventBus } from './infrastructure/broker/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { PrismaVideoReadRepository } from './infrastructure/persistence/db/prisma-video.read.repository';
import { PrismaVideoRepository } from './infrastructure/persistence/db/prisma-video.repository';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ChannelRpcAdapter } from './infrastructure/rpc/adapters/channel.rpc.adapter';
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
    ClientsModule.register([
      {
        name: CHANNEL_SERVICE,
        options: {
          port: CHANNEL_PORT,
          host: CHANNEL_HOST,
        },
        transport: Transport.TCP,
      },
    ]),
    S3Module,
  ],
  controllers: [MediaMessagingController],
  providers: [
    {
      provide: VIDEO_REPOSITORY_TOKEN,
      useClass: PrismaVideoRepository,
    },
    {
      provide: VIDEO_REPOSITORY_READ_TOKEN,
      useClass: PrismaVideoReadRepository,
    },
    {
      provide: BROKER_EVENT_BUS_TOKEN,
      useClass: RabbitMQEventBus,
    },
    {
      provide: CHANNEL_ADAPTER_TOKEN,
      useClass: ChannelRpcAdapter,
    },
    ...handlers,
  ],
})
export class MediaModule {}
