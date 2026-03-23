import { RabbitMQModule } from '@app/infra-core';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RabbitMQModule.registerAsync(rabbitMQConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'identity', '.env'),
    }),
    AuthModule,
    UserModule,
  ],
})
export class IdentityModule {}
