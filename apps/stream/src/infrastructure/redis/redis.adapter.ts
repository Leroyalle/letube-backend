import { CACHE_TOKEN } from '@app/abstractions/cache/cache.token';
import type Redis from 'ioredis';

import { Inject } from '@nestjs/common';

import type { CacheManagerPort } from '../../application/ports/cache-manager.port';

export class RedisAdapter implements CacheManagerPort {
  constructor(@Inject(CACHE_TOKEN) private readonly client: Redis) {}

  public async add(key: string, value: string, ttl: number) {
    await this.client.set(key, value, 'EX', ttl);
  }

  public async del(key: string) {
    await this.client.del(key);
  }

  public async get(key: string) {
    return await this.client.get(key);
  }
}
