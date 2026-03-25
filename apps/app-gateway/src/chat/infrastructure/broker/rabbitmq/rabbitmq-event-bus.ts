import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

import type { BrokerEventBusPort } from '../../../application/ports/broker-event-bus.port';

import { MEDIA_QUEUE_TOKEN } from './tokens';

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
