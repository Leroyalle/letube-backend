import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { type ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

import { MEDIA_QUEUE_TOKEN } from './tokens';

export const rabbitMQConfig: ClientsModuleAsyncOptions = [
  {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      options: {
        urls: [configService.getOrThrow<string>('RMQ_URL')],
        queue: MEDIA_BROKER_QUEUES.processed,
      },
      transport: Transport.RMQ,
    }),
    name: MEDIA_QUEUE_TOKEN,
  },
];
