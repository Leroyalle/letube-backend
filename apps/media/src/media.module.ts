import { Module } from '@nestjs/common';
import { MediaController } from './presentation/http/media.controller';
import { S3ClientService } from './infrastructure/storage/s3/s3-client.service';
import { FILE_STORAGE_TOKEN } from './application/storage/file-storage.token';
import { commandHandlers } from './application/handlers/command-handlers';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CqrsModule } from '@nestjs/cqrs';

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
    ...commandHandlers,
  ],
})
export class MediaModule {}
