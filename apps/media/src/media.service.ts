import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  getHello(): string {
    return 'Hello World!';
  }
}
