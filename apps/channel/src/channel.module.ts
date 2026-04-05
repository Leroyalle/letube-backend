import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { CHANNEL_REPOSITORY } from './application/constants/channel-repository.token';
import { commandHandlers } from './application/handlers/command-handlers';
import { queryHandlers } from './application/handlers/query-handlers';
import { PrismaChannelRepository } from './infrastructure/persistence/prisma-channel.repository';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ChannelController } from './presentation/http/channel.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'channel', '.env'),
    }),
    CqrsModule.forRoot(),
  ],
  controllers: [ChannelController],
  providers: [
    { provide: CHANNEL_REPOSITORY, useClass: PrismaChannelRepository },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class ChannelModule {}
