import { Injectable } from '@nestjs/common';

@Injectable()
export class LeroyallePlayApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
