import * as cookieParser from 'cookie-parser';
import { APP_GATEWAY_PORT } from 'libs/infra-constants/src';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppGatewayModule } from './app-gateway.module';

async function bootstrap() {
  const app = (await NestFactory.create(AppGatewayModule)).setGlobalPrefix('api');
  app.enableCors('*');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(APP_GATEWAY_PORT);
}
void bootstrap();
