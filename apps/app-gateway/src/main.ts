import { NestFactory } from '@nestjs/core';
import { AppGatewayModule } from './app-gateway.module';
import { APP_GATEWAY_PORT } from '@infra';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppGatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(APP_GATEWAY_PORT);
}
bootstrap();
