import type { ClockPort } from '@app/abstractions/system/time/clock.port';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemClockService implements ClockPort {
  public now(): Date {
    return new Date();
  }
}
