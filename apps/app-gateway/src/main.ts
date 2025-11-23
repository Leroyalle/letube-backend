import { NestFactory } from '@nestjs/core';
import { AppGatewayModule } from './app-gateway.module';
import { APP_GATEWAY_PORT } from '@infra';

async function bootstrap() {
  const app = await NestFactory.create(AppGatewayModule);
  await app.listen(APP_GATEWAY_PORT);
}
bootstrap();
