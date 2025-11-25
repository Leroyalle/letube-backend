import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenModule, PrismaModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
