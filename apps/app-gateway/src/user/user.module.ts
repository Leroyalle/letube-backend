import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IDENTITY_PORT, IDENTITY_SERVICE, IDENTITY_SERVICE_HOST } from '@infra';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: IDENTITY_SERVICE,
        transport: Transport.TCP,
        options: { port: IDENTITY_PORT, host: IDENTITY_SERVICE_HOST },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
