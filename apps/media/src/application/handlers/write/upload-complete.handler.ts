import type { UploadCompletedDto } from '@contracts/media-worker/dto/upload-completed.dto';
import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { UploadCompleteCommand } from '../../commands/upload-complete.command';
import { visibilityMap } from '../../mappers/visibility-map';
import type { BrokerEventBusPort } from '../../ports/broker-event-bus.port';
import { BROKER_EVENT_BUS_TOKEN, VIDEO_REPOSITORY_TOKEN } from '../../ports/tokens';
import type { VideoRepositoryPort } from '../../ports/video-repository.port';

@CommandHandler(UploadCompleteCommand)
export class UploadCompleteHandler implements ICommandHandler<UploadCompleteCommand> {
  constructor(
    @Inject(VIDEO_REPOSITORY_TOKEN)
    private readonly videoRepository: VideoRepositoryPort,
    @Inject(BROKER_EVENT_BUS_TOKEN)
    private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: UploadCompleteCommand) {
    const video = await this.videoRepository.findById(command.sourceId);

    if (!video) throw new Error('Видео по ключу не найдено в базе данных');

    if (!video.canMakeUploaded()) throw new Error('Видео должно быть в состоянии UPLOADING');

    video.changeStatus('UPLOADED');

    await this.videoRepository.update(video);

    const dto: UploadCompletedDto = {
      sourceKey: video.props.sourceKey,
      sourceId: video.props.id,
      contentType: command.contentType.getValue(),
      visibility: visibilityMap[video.props.visibility.getValue()],
    };

    this.brokerEventBus.emit(MEDIA_BROKER_QUEUES.uploaded, dto);

    return { sourceId: video.props.id };
  }
}
