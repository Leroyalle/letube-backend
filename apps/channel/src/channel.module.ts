import { Module } from '@nestjs/common';
import { ChannelController } from './presentation/http/channel.controller';
import { ChannelService } from './channel.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/commands/command-handlers';
import { PrismaChannelRepository } from './infrastructure/persistence/prisma-channel.repository';
import { CHANNEL_REPOSITORY } from './application/tokens/channel-repository.token';
import { queryHandlers } from './application/queries/query-handlers';

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
    ChannelService,
    { provide: CHANNEL_REPOSITORY, useClass: PrismaChannelRepository },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class ChannelModule {}
