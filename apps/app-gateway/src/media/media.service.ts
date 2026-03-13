import type { UploadCompleteDto } from '@contracts/media/dto/upload-complete.dto';
import type { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';
import { MEDIA_PATTERNS } from '@contracts/media/patterns/media.patterns';
import type { UploadMediaRpc } from '@contracts/media/rpc/upload-media.rpc';
import { MEDIA_SERVICE } from 'libs/infra-constants/src';

import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MediaService {
  constructor(@Inject(MEDIA_SERVICE) private readonly mediaClient: ClientProxy) {}

  public getUploadUrl(dto: UploadMediaDto, userId: string) {
    const payload: UploadMediaRpc = { ...dto, userId };
    return this.mediaClient.send(MEDIA_PATTERNS.UPLOAD, payload);
  }

  public uploadComplete(dto: UploadCompleteDto) {
    return this.mediaClient.send(MEDIA_PATTERNS.UPLOAD_COMPLETE, dto);
  }
}
