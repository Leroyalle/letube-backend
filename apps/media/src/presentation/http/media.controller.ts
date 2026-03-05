import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIA_PATTERNS } from '@contracts/media/patterns/media.patterns';
import type { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UploadMediaCommand } from '../../application/commands/upload-media.command';

@Controller()
export class MediaController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(MEDIA_PATTERNS.UPLOAD)
  public uploadMedia(@Payload() dto: UploadMediaDto): Promise<string> {
    return this.commandBus.execute(
      new UploadMediaCommand(dto.filename, dto.contentType),
    );
  }
}
