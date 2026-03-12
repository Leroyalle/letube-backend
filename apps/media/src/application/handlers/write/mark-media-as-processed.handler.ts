import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { VideoRepositoryPort } from '../../../domain/interfaces/video-repository.port';
import { MarkMediaAsProcessedCommand } from '../../commands/mark-media-as-processed.command';
import { VIDEO_REPOSITORY_TOKEN } from '../../ports/tokens';

@CommandHandler(MarkMediaAsProcessedCommand)
export class MarkMediaAsProcessedHandler implements ICommandHandler<MarkMediaAsProcessedCommand> {
  constructor(
    @Inject(VIDEO_REPOSITORY_TOKEN) private readonly videoRepository: VideoRepositoryPort,
  ) {}

  public async execute(command: MarkMediaAsProcessedCommand) {
    const video = await this.videoRepository.findById(command.sourceId);

    if (!video) throw new Error('Видео по ключу не найдено в базе данных');

    if (!video.canMakeReady()) throw new Error('Видео должно быть в состоянии UPLOADED');

    video.setMasterKey(command.hlsMasterKey);
    video.changeStatus('READY');

    return this.videoRepository.update(video);
  }
}
