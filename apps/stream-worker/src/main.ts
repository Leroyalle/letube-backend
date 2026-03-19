import { NestFactory } from '@nestjs/core';

import { StreamWorkerModule } from './stream-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(StreamWorkerModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
