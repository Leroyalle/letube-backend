import { NestFactory } from '@nestjs/core';
import { LeroyallePlayApiGatewayModule } from './leroyalle-play-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(LeroyallePlayApiGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
