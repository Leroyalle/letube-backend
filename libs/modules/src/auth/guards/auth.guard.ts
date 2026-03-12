import { AUTH_PATTERNS, EAuthTokens, VerifyAccessTokenDto } from '@contracts/auth';
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

    const token = request.cookies?.[EAuthTokens.Access] as string;
    console.log(token, request.cookies);

    if (!token) throw new UnauthorizedException('Unauthorized');

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
