import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AUTH_PATTERNS,
  LoginDto,
  RegisterDto,
  SuccessLoginDto,
  TokenData,
} from '@contracts';
import { IDENTITY_SERVICE } from '@infra';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IDENTITY_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  public async login(dto: LoginDto, res: Response) {
    const data = await firstValueFrom<SuccessLoginDto>(
      this.userClient.send(AUTH_PATTERNS.LOGIN, dto),
    );

    res.cookie('refreshToken', data.refreshData.token, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return {
      data: {
        accessToken: data.accessData.token,
        expiresIn: data.accessData.expiresAt,
      },
      message: 'Login successful!',
    };
  }

  public async register(dto: RegisterDto, res: Response) {
    const data = await firstValueFrom<SuccessLoginDto | undefined>(
      this.userClient.send(AUTH_PATTERNS.REGISTER, dto),
    );

    if (!data) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ status: 'error', message: 'Register failed' });
    }

    this.setRefreshToken(data.refreshData, res);

    return {
      data: {
        accessToken: data.accessData.token,
        expiresIn: data.accessData.expiresAt,
      },
    };
  }

  private setRefreshToken(tokenData: TokenData, res: Response) {
    res.cookie('refreshToken', tokenData.token, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: tokenData.expiresAt.expiresMs,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
