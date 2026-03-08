import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
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
import { IDENTITY_SERVICE } from '@infra';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
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

      this.setToken(EAuthTokens.Refresh, data.refreshData, res);
      this.setToken(EAuthTokens.Access, data.accessData, res);
      return res.redirect('http://localhost:3002?success=Login');
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Login failed');
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

      console.log('datratatat', data);
      this.setToken(EAuthTokens.Refresh, data.refreshData, res);
      this.setToken(EAuthTokens.Access, data.accessData, res);

      return res.redirect('http://localhost:3002?access=Register');
      // return {
      //   message: 'Registration successful!',
      //   status: 'success',
      // };
    } catch (error) {
      console.log('AppGateway_AuthService_registerVerifyCode', error);

      if (error?.message) throw new BadRequestException(error.message);

      throw new InternalServerErrorException('Verification failed');
    }
  }

  // private setRefreshToken(tokenData: TokenData, res: Response) {
  //   res.cookie(EAuthTokens.Refresh, tokenData.token, {
  //     httpOnly: true,
  //     // secure: true,
  //     sameSite: 'strict',
  //     maxAge: tokenData.expiresAt.expiresMs,
  //     // maxAge: 30 * 24 * 60 * 60 * 1000,
  //   });
  // }

  // private setAccessToken(tokenData: TokenData, res: Response) {
  //   res.cookie(EAuthTokens.Access, tokenData.token, {
  //     httpOnly: true,
  //     // secure: true,
  //     sameSite: 'strict',
  //     maxAge: tokenData.expiresAt.expiresMs,
  //     // maxAge: 30 * 24 * 60 * 60 * 1000,
  //   });
  // }

  private setToken(name: EAuthTokens, tokenData: TokenData, res: Response) {
    res.cookie(name, tokenData.token, {
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

  public async googleLogin(res: Response) {
    const url = await firstValueFrom<string>(
      this.userClient.send(AUTH_PATTERNS.GOOGLE_LOGIN_URL, {}),
    );
    if (!url) {
      throw new InternalServerErrorException('Failed to get Google login URL');
    }
    return res.redirect(url);
  }

  public async googleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code;

    if (!code) {
      throw new BadRequestException('Google code not provided');
    }

    const data = await firstValueFrom<SuccessLoginDto>(
      this.userClient.send(AUTH_PATTERNS.GOOGLE_LOGIN, code),
    );

    this.setToken(EAuthTokens.Refresh, data.refreshData, res);
    this.setToken(EAuthTokens.Access, data.accessData, res);

    res.redirect('http://localhost:3002?access=LoginGoogle');
    return {
      message: 'Google login successful!',
      status: 'success',
    };
  }
}
