import { RedisModule } from '@app/infra-core/redis/redis.module';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CACHE_MANAGER_TOKEN, STREAM_REPOSITORY_TOKEN } from './application/ports/tokens';
import { StreamRepository } from './infrastructure/persistence/db/stream.repository';
import { RedisAdapter } from './infrastructure/redis/redis.adapter';
import { StreamController } from './presentation/http/stream.controller';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'stream', '.env'),
    }),
  ],
  providers: [
    {
      provide: STREAM_REPOSITORY_TOKEN,
      useClass: StreamRepository,
    },
    {
      provide: CACHE_MANAGER_TOKEN,
      useClass: RedisAdapter,
    },
  ],
  controllers: [StreamController],
})
export class StreamModule {}
