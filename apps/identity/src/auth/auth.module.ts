import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CodeModule } from './code/code.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATION_HOST,
  NOTIFICATION_PORT,
  NOTIFICATION_SERVICE,
} from '@infra';

@Module({
  imports: [
    TokenModule,
    PrismaModule,
    UserModule,
    CodeModule,
    ClientsModule.register([
      {
        transport: Transport.TCP,
        name: NOTIFICATION_SERVICE,
        options: {
          host: NOTIFICATION_HOST,
          port: NOTIFICATION_PORT,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
