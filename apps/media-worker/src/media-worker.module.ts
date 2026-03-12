import { RabbitMQModule } from '@app/infra-core';
import { S3Module } from '@app/infra-core/s3/s3.module';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { commandHandlers } from './application/handlers/command-handlers';
import {
  BROKER_EVENT_BUS_TOKEN,
  TEMP_FOLDER_TOKEN,
  VIDEO_PROCESSOR_TOKEN,
} from './application/ports/tokens';
import { RabbitMQEventBus } from './infrastructure/broker/rabbitmq/rabbitmq-event-bus';
import { rabbitMQConfig } from './infrastructure/broker/rabbitmq/rabbitmq.config';
import { TempFolderService } from './infrastructure/prepare/temp-folder/temp-folder.service';
import { FfmpegVideoProcessor } from './infrastructure/video/ffmpeg/ffmpeg-video.processor';
import { MediaWorkerMessagingController } from './presentation/messaging/media-worker.messaging.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'media-worker', '.env'),
    }),
    CqrsModule,
    RabbitMQModule.registerAsync(rabbitMQConfig),
    S3Module,
  ],
  providers: [
    {
      provide: TEMP_FOLDER_TOKEN,
      useClass: TempFolderService,
    },
    {
      provide: VIDEO_PROCESSOR_TOKEN,
      useClass: FfmpegVideoProcessor,
    },
    {
      provide: BROKER_EVENT_BUS_TOKEN,
      useClass: RabbitMQEventBus,
    },
    ...commandHandlers,
  ],
  controllers: [MediaWorkerMessagingController],
})
export class MediaWorkerModule {}
