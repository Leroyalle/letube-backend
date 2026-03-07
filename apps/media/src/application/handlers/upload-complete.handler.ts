import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { UploadCompleteCommand } from '../commands/upload-complete.command';
import type { FileStoragePort } from '../storage/file-storage.port';
import { FILE_STORAGE_TOKEN } from '../storage/file-storage.token';
import type { TempFolderPort } from '../temp-folder/temp-folder.port';
import { TEMP_FOLDER_TOKEN } from '../temp-folder/temp-folder.token';
import type { VideoProcessorPort } from '../video/video-processor.port';
import { VIDEO_PROCESSOR_TOKEN } from '../video/video-processor.token';

// TODO: вынести в воркер
@CommandHandler(UploadCompleteCommand)
export class UploadCompleteHandler implements ICommandHandler<UploadCompleteCommand> {
  constructor(
    @Inject(FILE_STORAGE_TOKEN)
    private readonly fileStorageService: FileStoragePort,
    @Inject(TEMP_FOLDER_TOKEN)
    private readonly tempFolderService: TempFolderPort,
    @Inject(VIDEO_PROCESSOR_TOKEN)
    private readonly videoProcessorService: VideoProcessorPort,
  ) {}

  public async execute(command: UploadCompleteCommand) {
    const readable = await this.fileStorageService.get(command.s3Key);
    if (!readable) throw new Error('Файл не найден');

    const { inputDir, outputDir } = this.tempFolderService.prepare(command.s3Key);
    await this.videoProcessorService.cup(inputDir, outputDir, readable);

    await this.fileStorageService.uploadFolder(`/tmp/video/${command.s3Key}`, command.s3Key);
  }
}
