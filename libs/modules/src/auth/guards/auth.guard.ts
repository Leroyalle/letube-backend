import { AUTH_PATTERNS, VerifyAccessTokenDto } from '@contracts/auth';
import { UserDto } from '@contracts/user';
import { Request } from 'express';
import { IDENTITY_SERVICE } from 'libs/infra-constants/src';
import { firstValueFrom } from 'rxjs';

import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import '../types/express';

export class AuthGuard implements CanActivate {
  public constructor(@Inject(IDENTITY_SERVICE) private readonly identityClient: ClientProxy) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // const token = request.cookies?.[EAuthTokens.Access] as string;
    // if (!token) throw new UnauthorizedException('Unauthorized');

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    try {
      const reqData: VerifyAccessTokenDto = { token };
      const user = await firstValueFrom<UserDto>(
        this.identityClient.send(AUTH_PATTERNS.VERIFY_ACCESS_TOKEN, reqData),
      );
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
