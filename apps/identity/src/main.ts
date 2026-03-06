import { IDENTITY_HOST, IDENTITY_PORT } from '@infra';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { IdentityModule } from './identity.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(IdentityModule, {
    transport: Transport.TCP,
    options: {
      port: IDENTITY_PORT,
      host: IDENTITY_HOST,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen();
}

void bootstrap();
