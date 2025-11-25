import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IDENTITY_PORT, IDENTITY_SERVICE, IDENTITY_HOST } from '@infra';

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
