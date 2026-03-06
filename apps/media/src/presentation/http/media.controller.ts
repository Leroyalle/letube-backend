import type { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';
import { MEDIA_PATTERNS } from '@contracts/media/patterns/media.patterns';

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UploadCompleteCommand } from '../../application/commands/upload-complete.command';
import { UploadMediaCommand } from '../../application/commands/upload-media.command';

@Controller()
export class MediaController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(MEDIA_PATTERNS.UPLOAD)
  public uploadMedia(@Payload() dto: UploadMediaDto): Promise<string> {
    return this.commandBus.execute(new UploadMediaCommand(dto.filename, dto.contentType));
  }

  @MessagePattern(MEDIA_PATTERNS.UPLOAD_COMPLETE)
  public uploadCompleteMedia(@Payload() dto: UploadMediaDto) {
    return this.commandBus.execute(new UploadCompleteCommand(dto.filename));
  }
}
