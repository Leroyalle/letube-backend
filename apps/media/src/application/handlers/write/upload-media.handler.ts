import type { FileStoragePort } from '@app/abstractions/storage/file-storage.port';
import { FILE_STORAGE_TOKEN } from '@app/abstractions/storage/file-storage.token';
import { MediaStorageResolver } from '@app/pure/media';
import { randomUUID } from 'crypto';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { Video } from '../../../domain/entities/video.entity';
import type { VideoRepositoryPort } from '../../../domain/interfaces/video-repository.port';
import { UploadMediaCommand } from '../../commands/upload-media.command';
import { VIDEO_REPOSITORY_TOKEN } from '../../ports/tokens';

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    @Inject(FILE_STORAGE_TOKEN)
    private readonly fileStorageService: FileStoragePort,
    @Inject(VIDEO_REPOSITORY_TOKEN)
    private readonly videoRepository: VideoRepositoryPort,
  ) {}

  public async execute(command: UploadMediaCommand) {
    const videoId = randomUUID();
    const key = MediaStorageResolver.generateUploadKey(
      videoId,
      command.filename,
      command.contentType.getValue(),
    );

    const domainVideo = new Video({
      id: videoId,
      name: command.name,
      description: command.description,
      channelId: command.channelId,
      sourceKey: key,
      hlsMasterKey: null,
      status: 'UPLOADING',
    });

    const url = await this.fileStorageService.getUploadUrl(key);

    const video = await this.videoRepository.create(domainVideo);

    return { url, sourceId: video.props.id, contentType: command.contentType.getValue() };
  }
}
