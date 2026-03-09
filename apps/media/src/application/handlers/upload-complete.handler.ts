import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { VideoRepositoryPort } from '../../domain/interfaces/video-repository.port';
import { UploadCompleteCommand } from '../commands/upload-complete.command';
import type { FileStoragePort } from '../ports/file-storage.port';
import type { TempFolderPort } from '../ports/temp-folder.port';
import {
  FILE_STORAGE_TOKEN,
  TEMP_FOLDER_TOKEN,
  VIDEO_PROCESSOR_TOKEN,
  VIDEO_REPOSITORY_TOKEN,
} from '../ports/tokens';
import type { VideoProcessorPort } from '../ports/video-processor.port';
import type { MediaStorageResolver } from '../services/media-storage-resolver/media-storage.resolver';

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
    private readonly mediaStorageResolver: MediaStorageResolver,
  ) {}

  public async execute(command: UploadCompleteCommand) {
    const video = await this.videoRepository.findById(command.sourceId);

    if (!video) throw new Error('Видео по ключу не найдено в базе данных');

    if (!video.canStartProcessing()) throw new Error('Видео уже обрабатывается');

    video.changeStatus('PROCESSING');

    const readable = await this.fileStorageService.get(video.props.sourceKey);

    if (!readable) throw new Error('Файл в хранилище не найден');

    const { inputDir, outputDir } = this.tempFolderService.prepare(
      command.sourceId,
      command.contentType,
    );

    await this.videoProcessorService.cut(inputDir, outputDir, readable);

    const hlsFolderKey = this.mediaStorageResolver.createHlsFolderKey(
      video.props.id,
      command.contentType,
    );

    await this.fileStorageService.uploadFolder(outputDir, hlsFolderKey);

    await this.videoRepository.update(video);
  }
}
