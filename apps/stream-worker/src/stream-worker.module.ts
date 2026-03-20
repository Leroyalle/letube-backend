import { S3Module } from '@app/infra-core/s3/s3.module';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { STREAM_PROCESSOR_TOKEN } from './application/ports/tokens';
import { StreamProcessor } from './infrastructure/stream-processor/stream.processor';
import { StreamWorkerController } from './presentation/messaging/stream-worker.controller';

@Module({
  imports: [
    S3Module,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'stream-worker', '.env'),
    }),
    CqrsModule,
  ],
  controllers: [StreamWorkerController],
  providers: [
    {
      provide: STREAM_PROCESSOR_TOKEN,
      useClass: StreamProcessor,
    },
  ],
})
export class StreamWorkerModule {}
