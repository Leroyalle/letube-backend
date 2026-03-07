import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { commandHandlers } from './application/handlers/command-handlers';
import { FILE_STORAGE_TOKEN } from './application/storage/file-storage.token';
import { TEMP_FOLDER_TOKEN } from './application/temp-folder/temp-folder.token';
import { VIDEO_PROCESSOR_TOKEN } from './application/video/video-processor.token';
import { TempFolderService } from './infrastructure/prepare/temp-folder/temp-folder.service';
import { S3ClientService } from './infrastructure/storage/s3/s3-client.service';
import { FfmpegVideoProcessor } from './infrastructure/video/ffmpeg/ffmpeg-video-processor.service';
import { MediaController } from './presentation/http/media.controller';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'media', '.env'),
    }),
  ],
  controllers: [MediaController],
  providers: [
    {
      provide: FILE_STORAGE_TOKEN,
      useClass: S3ClientService,
    },
    {
      provide: TEMP_FOLDER_TOKEN,
      useClass: TempFolderService,
    },
    {
      provide: VIDEO_PROCESSOR_TOKEN,
      useClass: FfmpegVideoProcessor,
    },
    ...commandHandlers,
  ],
})
export class MediaModule {}
