import { Authorization } from '@app/modules/auth/decorators/authorization.decorator';
import type { UploadCompleteDto } from '@contracts/media/dto/upload-complete.dto';
import { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';

import { Body, Controller, Post } from '@nestjs/common';

import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Authorization()
  @Post('upload')
  public getUploadUrl(@Body() dto: UploadMediaDto) {
    return this.mediaService.getUploadUrl(dto);
  }

  @Authorization()
  @Post('upload-complete')
  public uploadComplete(@Body() dto: UploadCompleteDto) {
    return this.mediaService.uploadComplete(dto);
  }
}
