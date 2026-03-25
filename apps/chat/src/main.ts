import { CHAT_QUEUES } from '@contracts/chat/queues/broker.queues';
import { CHAT_PORT } from '@infra';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type RmqOptions, Transport } from '@nestjs/microservices';

import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: CHAT_QUEUES.COMMANDS,
    },
  });
  await app.listen(CHAT_PORT);
}
void bootstrap();
