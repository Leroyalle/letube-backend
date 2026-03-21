import { RedisModule } from '@app/infra-core/redis/redis.module';
import { CHANNEL_HOST, CHANNEL_PORT, CHANNEL_SERVICE } from '@infra';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { handlers } from './application/handlers/handlers';
import {
  CACHE_MANAGER_TOKEN,
  CHANNEL_ADAPTER_TOKEN,
  STREAM_REPOSITORY_TOKEN,
} from './application/ports/tokens';
import { StreamRepository } from './infrastructure/persistence/db/stream.repository';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisAdapter } from './infrastructure/redis/redis.adapter';
import { ChannelRpcAdapter } from './infrastructure/rpc/adapters/channel.rpc.adapter';
import { StreamController } from './presentation/messaging/stream.controller';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'stream', '.env'),
    }),
    ClientsModule.register([
      {
        name: CHANNEL_SERVICE,
        transport: Transport.TCP,
        options: {
          host: CHANNEL_HOST,
          port: CHANNEL_PORT,
        },
      },
    ]),
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
    {
      provide: CHANNEL_ADAPTER_TOKEN,
      useClass: ChannelRpcAdapter,
    },

    ...handlers,
  ],
  controllers: [StreamController],
})
export class StreamModule {}
