import type { GetByIdDto } from '@contracts/media/dto/get-by-id.dto';
import type { MediaProcessedDto } from '@contracts/media/dto/media-processed.dto';
import type { UploadCompleteDto } from '@contracts/media/dto/upload-complete.dto';
import { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';
import { MEDIA_PATTERNS } from '@contracts/media/patterns/media.patterns';
import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';

import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { MarkMediaAsProcessedCommand } from '../../application/commands/mark-media-as-processed.command';
import { UploadCompleteCommand } from '../../application/commands/upload-complete.command';
import { UploadMediaCommand } from '../../application/commands/upload-media.command';
import { GetVideoByIdQuery } from '../../application/queries/get-video-by-id.query';
import { ContentType } from '../../domain/value-objects/content-type.vo';

@Controller()
export class MediaMessagingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(MEDIA_PATTERNS.UPLOAD)
  public uploadMedia(@Payload() dto: UploadMediaDto): Promise<string> {
    return this.commandBus.execute(
      new UploadMediaCommand(
        dto.name,
        dto.description,
        dto.channelId,
        dto.filename,
        ContentType.from(dto.contentType),
      ),
    );
  }

  @MessagePattern(MEDIA_PATTERNS.UPLOAD_COMPLETE)
  public uploadCompleteMedia(@Payload() dto: UploadCompleteDto) {
    return this.commandBus.execute(
      new UploadCompleteCommand(dto.sourceId, ContentType.from(dto.contentType)),
    );
  }

  @MessagePattern(MEDIA_PATTERNS.GET_BY_ID)
  public getById(@Payload() dto: GetByIdDto) {
    return this.queryBus.execute(new GetVideoByIdQuery(dto.id));
  }

  @EventPattern(MEDIA_BROKER_QUEUES.processed)
  public processMedia(@Payload() dto: MediaProcessedDto) {
    return this.commandBus.execute(
      new MarkMediaAsProcessedCommand(
        dto.sourceId,
        ContentType.from(dto.contentType),
        dto.hlsMasterKey,
      ),
    );
  }
}
