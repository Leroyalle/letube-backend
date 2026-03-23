import { Injectable } from '@nestjs/common';

import type { ClockPort } from '../../domain/ports/clock.port';

@Injectable()
export class SystemClockService implements ClockPort {
  public now(): Date {
    return new Date();
  }
}
