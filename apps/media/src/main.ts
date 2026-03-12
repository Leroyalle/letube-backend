import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';
import { MEDIA_HOST, MEDIA_PORT } from 'libs/infra-constants/src';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type RmqOptions, type TcpOptions, Transport } from '@nestjs/microservices';

import { MediaModule } from './media.module';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  const config = app.get(ConfigService);

  app.connectMicroservice<TcpOptions>({
    options: {
      port: MEDIA_PORT,
      host: MEDIA_HOST,
    },
    transport: Transport.TCP,
  });

  app.connectMicroservice<RmqOptions>({
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: MEDIA_BROKER_QUEUES.processed,
    },
    transport: Transport.RMQ,
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
