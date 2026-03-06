import { CHANNEL_HOST, CHANNEL_PORT, CHANNEL_SERVICE } from '@infra';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CHANNEL_SERVICE,
        transport: Transport.TCP,
        options: { port: CHANNEL_PORT, host: CHANNEL_HOST },
      },
    ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
