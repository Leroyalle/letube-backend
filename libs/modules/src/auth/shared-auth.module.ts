import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IDENTITY_HOST, IDENTITY_PORT, IDENTITY_SERVICE } from '@infra';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: IDENTITY_SERVICE,
        transport: Transport.TCP,
        options: {
          port: IDENTITY_PORT,
          host: IDENTITY_HOST,
        },
      },
    ]),
  ],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard],
})
export class SharedAuthModule {}
