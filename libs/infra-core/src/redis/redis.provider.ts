import { CACHE_TOKEN } from '@app/abstractions/cache/cache.token';
import Redis from 'ioredis';

import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const redisProvider: Provider = {
  provide: CACHE_TOKEN,
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
    });
  },
  inject: [ConfigService],
};
