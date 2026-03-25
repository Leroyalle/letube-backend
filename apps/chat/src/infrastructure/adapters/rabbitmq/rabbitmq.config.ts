import { CHAT_QUEUES } from '@contracts/chat/queues/broker.queues';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { type ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

import { MEDIA_QUEUE_TOKEN } from './rabbitmq.token';

export const rabbitMQConfig: ClientsModuleAsyncOptions = [
  {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow<string>('RMQ_URL')],
        queue: CHAT_QUEUES.EVENTS_GATEWAY,
      },
    }),
    name: MEDIA_QUEUE_TOKEN,
  },
];
