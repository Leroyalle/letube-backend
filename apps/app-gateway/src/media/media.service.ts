import type { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';
import { MEDIA_PATTERNS } from '@contracts/media/patterns/media.patterns';
import { MEDIA_SERVICE } from '@infra';

import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MediaService {
  constructor(@Inject(MEDIA_SERVICE) private readonly mediaClient: ClientProxy) {}

  public getUploadUrl(dto: UploadMediaDto) {
    return this.mediaClient.send(MEDIA_PATTERNS.UPLOAD, dto);
  }

  public uploadComplete(dto: UploadMediaDto) {
    return this.mediaClient.send(MEDIA_PATTERNS.UPLOAD_COMPLETE, dto);
  }
}
