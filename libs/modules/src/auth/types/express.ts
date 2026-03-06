/* eslint-disable @typescript-eslint/no-namespace */
import { UserDto } from '@contracts/user';

declare global {
  namespace Express {
    interface Request {
      user?: UserDto;
    }
  }
}

export {};
