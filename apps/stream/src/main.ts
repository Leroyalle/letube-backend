import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TcpOptions, Transport } from '@nestjs/microservices';

import { StreamModule } from './stream.module';

async function bootstrap() {
  const app = await NestFactory.create(StreamModule);
  const config = app.get(ConfigService);

  app.connectMicroservice<TcpOptions>({
    transport: Transport.TCP,
    options: {
      host: config.getOrThrow<string>('STREAM_HOST'),
      port: config.getOrThrow<number>('STREAM_PORT'),
    },
  });

  await app.startAllMicroservices();
  await app.init();
}

void bootstrap();
