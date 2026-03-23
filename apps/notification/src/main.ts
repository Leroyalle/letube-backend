import { NOTIFICATION_BROKER_QUEUES } from '@contracts/notification/queues/broker.queues';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type RmqOptions, Transport } from '@nestjs/microservices';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const config = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: NOTIFICATION_BROKER_QUEUES.SEND_MESSAGE,
    },
  });
  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
