import { CLOCK_TOKEN } from '@app/abstractions/system/time/clock.token';
import { RabbitMQModule } from '@app/infra-core';
import { RedisModule } from '@app/infra-core/redis/redis.module';
import { SystemClockService } from '@app/infra-core/time/system-clock.service';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { handlers } from './application/handlers/handlers';
import { BROKER_EVENT_BUS_TOKEN, CHAT_CACHE_ADAPTER_TOKEN } from './application/ports/tokens';
import { ChatCacheAdapter } from './infrastructure/adapters/cache/chat-cache.adapter';
import { RabbitMQEventBus } from './infrastructure/adapters/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/adapters/rabbitmq/rabbitmq.config';
import { RedisAdapter } from './infrastructure/adapters/redis/redis.adapter';
import { ChatEventsController } from './presentation/events/chat.events.controller';

@Module({
  imports: [
    RedisModule,
    CqrsModule,
    RabbitMQModule.registerAsync(rabbitMQConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'chat', '.env'),
    }),
  ],
  controllers: [ChatEventsController],
  providers: [
    ...handlers,
    RedisAdapter,
    { provide: CLOCK_TOKEN, useClass: SystemClockService },
    { provide: BROKER_EVENT_BUS_TOKEN, useClass: RabbitMQEventBus },
    { provide: CHAT_CACHE_ADAPTER_TOKEN, useClass: ChatCacheAdapter },
  ],
})
export class ChatModule {}
