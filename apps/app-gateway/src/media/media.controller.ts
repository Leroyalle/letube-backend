import { Authorization } from '@app/modules/auth/decorators/authorization.decorator';
import { CurrentUserDecorator } from '@app/modules/auth/decorators/current-user.decorator';
import type { UploadCompleteDto } from '@contracts/media/dto/upload-complete.dto';
import { UploadMediaDto } from '@contracts/media/dto/upload-media.dto';
import type { UserDto } from '@contracts/user';

import { Body, Controller, Post } from '@nestjs/common';

import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Authorization()
  @Post('upload')
  public getUploadUrl(@Body() dto: UploadMediaDto, @CurrentUserDecorator() user: UserDto) {
    return this.mediaService.getUploadUrl(dto, user.id);
  }

  @Authorization()
  @Post('upload-complete')
  public uploadComplete(@Body() dto: UploadCompleteDto) {
    return this.mediaService.uploadComplete(dto);
  }
}
