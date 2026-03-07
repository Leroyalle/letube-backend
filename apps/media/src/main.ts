import { MEDIA_HOST, MEDIA_PORT, MEDIA_SERVICE } from '@infra';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MediaModule } from './media.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MediaModule, {
    options: {
      name: MEDIA_SERVICE,
      port: MEDIA_PORT,
      host: MEDIA_HOST,
    },
    transport: Transport.TCP,
  });

  await app.listen();
}
void bootstrap();
