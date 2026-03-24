import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  public getHello(): string {
    return 'Hello World!';
  }
}
