import { CHAT_QUEUES } from '@contracts/chat/queues/broker.queues';
import * as cookieParser from 'cookie-parser';
import { APP_GATEWAY_PORT } from 'libs/infra-constants/src';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';

import { AppGatewayModule } from './app-gateway.module';
import { RedisIoAdapter } from './chat/infrastructure/transport/ws/redis-io.adapter';

async function bootstrap() {
  const app = (await NestFactory.create(AppGatewayModule)).setGlobalPrefix('api');

  const config = app.get(ConfigService);

  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: CHAT_QUEUES.EVENTS_GATEWAY,
    },
  });

  app.enableCors('*');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.startAllMicroservices();
  await app.listen(APP_GATEWAY_PORT);
}
void bootstrap();
