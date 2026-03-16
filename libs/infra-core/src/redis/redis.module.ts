import { Module } from '@nestjs/common';

import { redisProvider } from './redis.provider';

@Module({
  providers: [redisProvider],
})
export class RedisModule {}
