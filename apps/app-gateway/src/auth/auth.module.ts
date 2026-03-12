import { IDENTITY_HOST, IDENTITY_PORT, IDENTITY_SERVICE } from 'libs/infra-constants/src';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.TCP,
        name: IDENTITY_SERVICE,
        options: {
          port: IDENTITY_PORT,
          host: IDENTITY_HOST,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
