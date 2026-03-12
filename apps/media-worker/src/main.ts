import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type RmqOptions, Transport } from '@nestjs/microservices';

import { MediaWorkerModule } from './media-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(MediaWorkerModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: MEDIA_BROKER_QUEUES.uploaded,
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
