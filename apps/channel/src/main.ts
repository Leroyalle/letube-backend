import { CHANNEL_HOST, CHANNEL_PORT } from 'libs/infra-constants/src';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ChannelModule } from './channel.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ChannelModule, {
    transport: Transport.TCP,
    options: { port: CHANNEL_PORT, host: CHANNEL_HOST },
  });
  await app.listen();
}
void bootstrap();
