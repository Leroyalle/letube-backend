import { NestFactory } from '@nestjs/core';

import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
