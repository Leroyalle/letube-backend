import { S3Module } from '@app/infra-core/s3/s3.module';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { handlers } from './application/handlers/handlers';
import { STREAM_PROCESSOR_TOKEN } from './application/ports/tokens';
import { StreamProcessor } from './infrastructure/stream-processor/stream.processor';
import { StreamWorkerEventsController } from './presentation/events/stream-worker.events.controller';

@Module({
  imports: [
    S3Module,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'stream-worker', '.env'),
    }),
    CqrsModule,
  ],
  controllers: [StreamWorkerEventsController],
  providers: [
    {
      provide: STREAM_PROCESSOR_TOKEN,
      useClass: StreamProcessor,
    },
    ...handlers,
  ],
})
export class StreamWorkerModule {}
