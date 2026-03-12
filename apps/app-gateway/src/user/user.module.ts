import { SharedAuthModule } from '@app/modules';
import { IDENTITY_HOST, IDENTITY_PORT, IDENTITY_SERVICE } from 'libs/infra-constants/src';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: IDENTITY_SERVICE,
        transport: Transport.TCP,
        options: { port: IDENTITY_PORT, host: IDENTITY_HOST },
      },
    ]),
    SharedAuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
