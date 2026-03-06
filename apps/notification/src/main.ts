import { NOTIFICATION_HOST, NOTIFICATION_PORT } from '@infra';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.TCP,
    options: {
      port: NOTIFICATION_PORT,
      host: NOTIFICATION_HOST,
    },
  });
  await app.listen();
}
void bootstrap();
