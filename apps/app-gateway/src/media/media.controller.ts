import type { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';

import { Controller } from '@nestjs/common';

import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  public getUploadUrl(dto: UploadMediaDto) {
    return this.mediaService.getUploadUrl(dto);
  }

  public uploadComplete(dto: UploadMediaDto) {
    return this.mediaService.uploadComplete(dto);
  }
}
