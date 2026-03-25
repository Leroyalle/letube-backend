import { RabbitMQModule } from '@app/infra-core';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BROKER_EVENT_BUS_TOKEN } from './application/ports/token';
import { RabbitMQEventBus } from './infrastructure/broker/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { ChatClientService } from './infrastructure/transport/chat-client.service';
import { ChatEmitter } from './infrastructure/transport/ws/chat.emitter';
import { ChatEventsController } from './presentation/events/chat.events.controller';
import { ChatGateway } from './presentation/ws/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'app-gateway', '.env'),
    }),
    RabbitMQModule.registerAsync(rabbitMQConfig),
  ],
  providers: [
    ChatGateway,
    ChatClientService,
    ChatEmitter,
    ChatEventsController,
    {
      provide: BROKER_EVENT_BUS_TOKEN,
      useClass: RabbitMQEventBus,
    },
  ],
})
export class ChatModule {}
