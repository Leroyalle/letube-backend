import { Controller, Get } from '@nestjs/common';
import { LeroyallePlayApiGatewayService } from './leroyalle-play-api-gateway.service';

@Controller()
export class LeroyallePlayApiGatewayController {
  constructor(
    private readonly leroyallePlayApiGatewayService: LeroyallePlayApiGatewayService,
  ) {}

  @Get()
  getHello(): string {
    return this.leroyallePlayApiGatewayService.getHello();
  }
}
