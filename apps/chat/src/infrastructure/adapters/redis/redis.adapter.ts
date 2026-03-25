import { CACHE_TOKEN } from '@app/abstractions/cache/cache.token';
import type Redis from 'ioredis';

import { Inject } from '@nestjs/common';

import type { CacheManagerPort } from '../../../application/ports/cache-manager.port';

export class RedisAdapter implements CacheManagerPort {
  constructor(@Inject(CACHE_TOKEN) private readonly client: Redis) {}

  public async zadd(key: string, score: number, value: string) {
    await this.client.zadd(key, score, value);
  }

  public async zrevrange(key: string, start: number, stop: number) {
    return await this.client.zrevrange(key, start, stop);
  }

  public async zremrangebyrank(key: string, start: number, stop: number) {
    await this.client.zremrangebyrank(key, start, stop);
  }

  public async expire(key: string, ttl: number) {
    await this.client.expire(key, ttl);
  }
}
