import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;

  constructor(app: INestApplication) {
    super(app);
  }

  public connectToRedis(): void {
    const pubClient = new Redis({
      host: 'localhost',
      port: 6379,
    });

    const subClient = pubClient.duplicate();

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  public createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    server.adapter(this.adapterConstructor);

    return server;
  }
}
