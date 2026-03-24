import type { BrokerEventBusPort } from 'apps/chat/src/application/ports/broker-event-bus.port';

import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

import { MEDIA_QUEUE_TOKEN } from './rabbitmq.token';

@Injectable()
export class RabbitMQEventBus implements BrokerEventBusPort {
  constructor(
    @Inject(MEDIA_QUEUE_TOKEN)
    private readonly client: ClientProxy,
  ) {}

  public emit(event: string, payload: unknown) {
    return this.client.emit(event, payload);
  }
}
