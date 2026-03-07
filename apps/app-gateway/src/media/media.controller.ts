import { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';

import { Body, Controller, Post } from '@nestjs/common';

import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  public getUploadUrl(@Body() dto: UploadMediaDto) {
    return this.mediaService.getUploadUrl(dto);
  }

  @Post('upload-complete')
  public uploadComplete(@Body() dto: UploadMediaDto) {
    return this.mediaService.uploadComplete(dto);
  }
}
