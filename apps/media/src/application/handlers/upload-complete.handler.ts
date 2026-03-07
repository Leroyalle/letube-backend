import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { VideoRepositoryPort } from '../../domain/interfaces/video-repository.port';
import { UploadCompleteCommand } from '../commands/upload-complete.command';
import type { FileStoragePort } from '../persistence/file-storage.port';
import { FILE_STORAGE_TOKEN } from '../persistence/file-storage.token';
import { VIDEO_REPOSITORY_TOKEN } from '../persistence/video-repository.token';
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
    @Inject(VIDEO_REPOSITORY_TOKEN)
    private readonly videoRepository: VideoRepositoryPort,
  ) {}

  public async execute(command: UploadCompleteCommand) {
    const video = await this.videoRepository.findByKey(command.s3Key);

    if (!video) throw new Error('Видео по ключу не найдено в базе данных');

    if (!video.canStartProcessing()) throw new Error('Видео уже обрабатывается');

    video.changeStatus('UPLOADING');

    const readable = await this.fileStorageService.get(command.s3Key);

    if (!readable) throw new Error('Файл в хранилище не найден');

    const { inputDir, outputDir } = this.tempFolderService.prepare(command.s3Key);

    await this.videoProcessorService.cup(inputDir, outputDir, readable);

    await this.fileStorageService.uploadFolder(`/tmp/video/${command.s3Key}`, command.s3Key);

    await this.videoRepository.update(video);
  }
}
