import { STREAM_WORKER_BROKER_QUEUES } from '@contracts/stream-worker/queues/broker.queues';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';

import { StreamWorkerModule } from './stream-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(StreamWorkerModule);
  const config = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: STREAM_WORKER_BROKER_QUEUES.on_hls,
    },
  });

  await app.startAllMicroservices();
  await app.init();
}

void bootstrap();
