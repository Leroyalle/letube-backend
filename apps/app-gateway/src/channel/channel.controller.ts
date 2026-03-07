import type { CreateChannelDto, FindByIdDto, FindByUserIdDto } from '@contracts/channel';

import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  public create(@Body() dto: CreateChannelDto) {
    return this.channelService.create(dto);
  }

  @Get(':id')
  public findById(@Param() dto: FindByIdDto) {
    return this.channelService.findById(dto);
  }

  @Get(':userId')
  public findByUserId(@Param() dto: FindByUserIdDto) {
    return this.channelService.findByUserId(dto);
  }

  @Get()
  public findAll() {
    return this.channelService.findAll();
  }
}
