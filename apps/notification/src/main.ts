import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NOTIFICATION_HOST, NOTIFICATION_PORT } from '@infra';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.TCP,
      options: {
        port: NOTIFICATION_PORT,
        host: NOTIFICATION_HOST,
      },
    },
  );
  await app.listen();
}
bootstrap();
