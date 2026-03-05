import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  getHello(): string {
    return this.mediaService.getHello();
  }
}
