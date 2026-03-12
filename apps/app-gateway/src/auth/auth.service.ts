import {
  AUTH_PATTERNS,
  EAuthTokens,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SuccessLoginDto,
  TokenData,
  VerifyCodeDto,
} from '@contracts/auth';
import { SendMessageResponseDto } from '@contracts/notification';
import { Response } from 'express';
import { IDENTITY_SERVICE } from 'libs/infra-constants/src';
import { firstValueFrom } from 'rxjs';

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject(IDENTITY_SERVICE) private readonly userClient: ClientProxy) {}

  public async login(dto: LoginDto, res: Response) {
    try {
      const data = await firstValueFrom<SuccessLoginDto>(
        this.userClient.send(AUTH_PATTERNS.LOGIN, dto),
      );

      this.setRefreshToken(data.refreshData, res);

      return {
        data: {
          accessToken: data.accessData.token,
          expiresIn: data.accessData.expiresAt,
        },
        message: 'Login successful!',
      };
    } catch (error) {
      console.log('AppGateway_AuthService_login', error);
    }
  }

  public async registerSendVerificationCode(dto: RegisterDto) {
    try {
      const data = await firstValueFrom<SendMessageResponseDto | undefined>(
        this.userClient.send(AUTH_PATTERNS.REGISTER_SEND_VERIFICATION_CODE, dto),
      );

      if (!data || data.status === 'error') {
        throw new InternalServerErrorException('Verification code sending failed');
      }

      // this.setRefreshToken(data.refreshData, res);

      return {
        status: data.status,
        message: 'The letter with verification code has been sent to your email!',
      };
    } catch (error) {
      console.log('AppGateway_AuthService_sendVerificationCode', error);
      if (error?.message === 'User has already exists') {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  public async registerVerifyCode(dto: VerifyCodeDto, res: Response) {
    try {
      const data = await firstValueFrom<SuccessLoginDto | undefined>(
        this.userClient.send(AUTH_PATTERNS.REGISTER_VERIFY_CODE, dto),
      );

      if (!data) {
        throw new InternalServerErrorException('Registration failed');
      }

      this.setRefreshToken(data.refreshData, res);

      return {
        accessToken: data.accessData.token,
        expiresIn: data.accessData.expiresAt.expiresMs,
      };
    } catch (error) {
      console.log('AppGateway_AuthService_registerVerifyCode', error);
    }
  }

  private setRefreshToken(tokenData: TokenData, res: Response) {
    res.cookie(EAuthTokens.Refresh, tokenData.token, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: tokenData.expiresAt.expiresMs,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  public async forgotPassword(dto: ForgotPasswordDto) {
    const data = await firstValueFrom<SendMessageResponseDto>(
      this.userClient.send(AUTH_PATTERNS.FORGOT_PASSWORD, dto),
    );

    if (!data || data.status === 'error') {
      throw new InternalServerErrorException('Sending code failed');
    }

    return {
      message: 'The letter with verification code has been sent to your email!',
      status: data.status,
    };
  }

  public async resetPassword(dto: ResetPasswordDto) {
    const data = await firstValueFrom<SendMessageResponseDto>(
      this.userClient.send(AUTH_PATTERNS.RESET_PASSWORD, dto),
    );

    if (!data || data.status === 'error') {
      throw new InternalServerErrorException('Error resetting password');
    }

    return {
      message: 'Your password has been changed successfully!',
      status: data.status,
    };
  }
}
