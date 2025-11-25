import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AUTH_PATTERNS,
  LoginDto,
  RegisterDto,
  SendMessageResponseDto,
  SuccessLoginDto,
  TokenData,
  VerifyCodeDto,
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
        this.userClient.send(
          AUTH_PATTERNS.REGISTER_SEND_VERIFICATION_CODE,
          dto,
        ),
      );

      if (!data || data.status === 'error') {
        throw new InternalServerErrorException(
          'Verification code sending failed',
        );
      }

      // this.setRefreshToken(data.refreshData, res);

      return {
        status: data.status,
        message:
          'The letter with verification code has been sent to your email!',
      };
    } catch (error) {
      console.log('AppGateway_AuthService_sendVerificationCode', error);
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
    res.cookie('refreshToken', tokenData.token, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: tokenData.expiresAt.expiresMs,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
