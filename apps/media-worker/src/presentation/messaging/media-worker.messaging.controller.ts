import type { UploadCompletedDto } from '@contracts/media-worker/dto/upload-completed.dto';
import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ProcessMediaCommand } from '../../application/commands/process-media.command';
import { ContentType } from '../../domain/value-objects/content-type.vo';

@Controller()
export class MediaWorkerMessagingController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(MEDIA_BROKER_QUEUES.uploaded)
  public processMedia(@Payload() dto: UploadCompletedDto) {
    const handlers = (this.commandBus as any).handlers;
    console.log('registered handlers:', handlers);
    return this.commandBus.execute(
      new ProcessMediaCommand(dto.sourceKey, dto.sourceId, ContentType.from(dto.contentType)),
    );
  }
}
