import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
