import { RabbitMQModule } from '@app/infra-core';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { handlers } from './application/commands/handlers';
import { BROKER_EVENT_BUS_TOKEN } from './application/ports/token';
import { ChatClientService } from './application/use-cases/chat-client.service';
import { RabbitMQEventBus } from './infrastructure/broker/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { ChatEmitter } from './infrastructure/transport/ws/chat.emitter';
import { ChatEventsController } from './presentation/events/chat.events.controller';
import { ChatGateway } from './presentation/ws/chat.gateway';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'app-gateway', '.env'),
    }),
    RabbitMQModule.registerAsync(rabbitMQConfig),
  ],
  controllers: [ChatEventsController],
  providers: [
    ChatGateway,
    ChatClientService,
    ChatEmitter,
    ...handlers,
    {
      provide: BROKER_EVENT_BUS_TOKEN,
      useClass: RabbitMQEventBus,
    },
  ],
})
export class ChatModule {}
