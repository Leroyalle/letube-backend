import { STREAM_BROKER_QUEUES } from '@contracts/stream/queues/broker.queues';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { StreamWorkerModule } from './stream-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(StreamWorkerModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: STREAM_BROKER_QUEUES.published,
    },
  });

  await app.startAllMicroservices();
  await app.init();
}

void bootstrap();
