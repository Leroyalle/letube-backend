import { SharedAuthModule } from '@app/modules';
import {
  IDENTITY_HOST,
  IDENTITY_PORT,
  IDENTITY_SERVICE,
  STREAM_HOST,
  STREAM_PORT,
  STREAM_SERVICE,
} from '@infra';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [
    SharedAuthModule,
    ClientsModule.register([
      {
        name: IDENTITY_SERVICE,
        options: {
          host: IDENTITY_HOST,
          port: IDENTITY_PORT,
        },
        transport: Transport.TCP,
      },
    ]),
    ClientsModule.register([
      {
        name: STREAM_SERVICE,
        options: {
          host: STREAM_HOST,
          port: STREAM_PORT,
        },
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
