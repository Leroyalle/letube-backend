import type { CreateChannelDto, FindByIdDto, FindByUserIdDto } from '@contracts/channel';

import { Controller } from '@nestjs/common';

import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  public create(dto: CreateChannelDto) {
    return this.channelService.create(dto);
  }

  public findById(dto: FindByIdDto) {
    return this.channelService.findById(dto);
  }

  public findByUserId(dto: FindByUserIdDto) {
    return this.channelService.findByUserId(dto);
  }

  public findAll() {
    return this.channelService.findAll();
  }
}
