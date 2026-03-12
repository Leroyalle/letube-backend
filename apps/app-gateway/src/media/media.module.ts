import { MEDIA_HOST, MEDIA_PORT, MEDIA_SERVICE } from 'libs/infra-constants/src';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MEDIA_SERVICE,
        options: {
          host: MEDIA_HOST,
          port: MEDIA_PORT,
        },
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
