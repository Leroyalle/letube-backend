import { Module } from '@nestjs/common';
import { LeroyallePlayApiGatewayController } from './leroyalle-play-api-gateway.controller';
import { LeroyallePlayApiGatewayService } from './leroyalle-play-api-gateway.service';

@Module({
  imports: [],
  controllers: [LeroyallePlayApiGatewayController],
  providers: [LeroyallePlayApiGatewayService],
})
export class LeroyallePlayApiGatewayModule {}
