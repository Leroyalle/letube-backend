import { Module } from '@nestjs/common';

import { StreamWorkerController } from './stream-worker.controller';

@Module({
  imports: [],
  controllers: [StreamWorkerController],
})
export class StreamWorkerModule {}
