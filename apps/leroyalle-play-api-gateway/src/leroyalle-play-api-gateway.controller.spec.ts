import { Test, TestingModule } from '@nestjs/testing';
import { LeroyallePlayApiGatewayController } from './leroyalle-play-api-gateway.controller';
import { LeroyallePlayApiGatewayService } from './leroyalle-play-api-gateway.service';

describe('LeroyallePlayApiGatewayController', () => {
  let leroyallePlayApiGatewayController: LeroyallePlayApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LeroyallePlayApiGatewayController],
      providers: [LeroyallePlayApiGatewayService],
    }).compile();

    leroyallePlayApiGatewayController = app.get<LeroyallePlayApiGatewayController>(LeroyallePlayApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(leroyallePlayApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
