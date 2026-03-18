import { STREAM_HOST, STREAM_PORT } from '@infra';

import { NestFactory } from '@nestjs/core';
import { TcpOptions, Transport } from '@nestjs/microservices';

import { StreamModule } from './stream.module';

async function bootstrap() {
  const app = await NestFactory.create(StreamModule);

  app.connectMicroservice<TcpOptions>({
    transport: Transport.TCP,
    options: {
      host: STREAM_HOST,
      port: STREAM_PORT,
    },
  });

  await app.startAllMicroservices();
  await app.init();
}

void bootstrap();
