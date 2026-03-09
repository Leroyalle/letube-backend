import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { commandHandlers } from './application/handlers/command-handlers';
import {
  FILE_STORAGE_TOKEN,
  TEMP_FOLDER_TOKEN,
  VIDEO_PROCESSOR_TOKEN,
  VIDEO_REPOSITORY_TOKEN,
} from './application/ports/tokens';
import { MediaStorageResolver } from './application/services/media-storage-resolver/media-storage.resolver';
import { PrismaVideoRepository } from './infrastructure/persistence/db/prisma-video.repository';
import { S3ClientService } from './infrastructure/persistence/s3/s3-client.service';
import { TempFolderService } from './infrastructure/prepare/temp-folder/temp-folder.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { FfmpegVideoProcessor } from './infrastructure/video/ffmpeg/ffmpeg-video.processor';
import { MediaController } from './presentation/http/media.controller';

@Module({
  imports: [
    PrismaModule,
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
    {
      provide: VIDEO_REPOSITORY_TOKEN,
      useClass: PrismaVideoRepository,
    },
    MediaStorageResolver,
    ...commandHandlers,
  ],
})
export class MediaModule {}
