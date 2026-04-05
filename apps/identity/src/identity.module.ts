import type { ClockPort } from '@app/abstractions/system/time/clock.port';
import { CLOCK_TOKEN } from '@app/abstractions/system/time/clock.token';
import { RabbitMQModule } from '@app/infra-core';
import { SystemClockService } from '@app/infra-core/time/system-clock.service';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { handlers } from './application/handlers/commands/handlers';
import { queries } from './application/handlers/queries/queries';
import {
  ACCESS_SERVICE_TOKEN,
  BROKER_EVENT_BUS_TOKEN,
  PASSWORD_HASHER_TOKEN,
  REFRESH_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from './application/ports/tokens';
import type { CodeGeneratorPort } from './domain/ports/code-generator.port';
import { CODE_GENERATOR_TOKEN } from './domain/ports/tokens';
import { VerificationCodeService } from './domain/services/verification-code.service';
import { RabbitMQEventBus } from './infrastructure/broker/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { RefreshTokenRepository } from './infrastructure/persistence/db/refresh-token/refresh-token.repository';
import { UserReadRepository } from './infrastructure/persistence/db/user/user.read.repository';
import { UserRepository } from './infrastructure/persistence/db/user/user.repository';
import { VerificationCodeRepository } from './infrastructure/persistence/db/verification-code/verification-code.repository';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ArgonPasswordHasher } from './infrastructure/security/password-hasher/argon-password.hasher';
import { CodeGenerator } from './infrastructure/system/code.generator';
import { AccessTokenService } from './infrastructure/token/access-token.service';
import { RefreshTokenService } from './infrastructure/token/refresh-token.service';
import { IdentityCommandsController } from './presentation/commands/identity.commands.controller';
import { IdentityQueriesController } from './presentation/queries/identity.queries.controller';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    JwtModule,
    RabbitMQModule.registerAsync(rabbitMQConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'identity', '.env'),
    }),
  ],
  controllers: [IdentityCommandsController, IdentityQueriesController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: USER_READ_REPOSITORY_TOKEN,
      useClass: UserReadRepository,
    },
    {
      provide: VERIFICATION_CODE_REPOSITORY_TOKEN,
      useClass: VerificationCodeRepository,
    },
    {
      provide: ACCESS_SERVICE_TOKEN,
      useClass: AccessTokenService,
    },
    {
      provide: REFRESH_SERVICE_TOKEN,
      useClass: RefreshTokenService,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY_TOKEN,
      useClass: RefreshTokenRepository,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: ArgonPasswordHasher,
    },
    {
      provide: BROKER_EVENT_BUS_TOKEN,
      useClass: RabbitMQEventBus,
    },
    {
      provide: CODE_GENERATOR_TOKEN,
      useClass: CodeGenerator,
    },
    {
      provide: CLOCK_TOKEN,
      useClass: SystemClockService,
    },
    {
      provide: VerificationCodeService,
      useFactory: (clockService: ClockPort, codeGenerator: CodeGeneratorPort) => {
        return new VerificationCodeService(clockService, codeGenerator);
      },
      inject: [CLOCK_TOKEN, CODE_GENERATOR_TOKEN],
    },
    ...handlers,
    ...queries,
  ],
})
export class IdentityModule {}
