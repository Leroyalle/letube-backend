import {
  ECodeType,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SuccessLoginDto,
  TokenData,
  VerifyAccessTokenDto,
  VerifyCodeDto,
} from '@contracts/auth';
import {
  SendMessageDto,
  SendMessageResponseDto,
  NOTIFICATION_PATTERNS,
} from '@contracts/notification';
import { UserDto, EUserRole } from '@contracts/user';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AccessTokenService } from './token/services/access-token.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenService } from './token/services/refresh-token.service';
import { CodeService } from './code/code.service';
import { firstValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '@infra';
import { IGoogleUserResponse } from '@contracts/auth/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly prisma: PrismaService,
    private readonly codeService: CodeService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}

  public async login(dto: LoginDto): Promise<SuccessLoginDto | undefined> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('This account is not registered.');
    }

    const isValidPassword = await argon2.verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new NotFoundException('Invalid credentials.');
    }

    const accessData = await this.accessTokenService.signAccessToken({
      id: user.id,
      // FIXME: заткнул тс по причине двух енамов (призма и либа), мб замаппить
      email: user.email,
      role: user.role as EUserRole,
    });

    const refreshData = this.refreshTokenService.generate();

    const hashedRefresh = await this.refreshTokenService.hash(
      refreshData.token,
    );

    await this.updateRefreshToken(user.id, {
      token: hashedRefresh,
      expiresAt: refreshData.expiresAt,
    });

    return { accessData, refreshData };
  }

  public async registerSendVerificationCode(
    dto: RegisterDto,
  ): Promise<SendMessageResponseDto | undefined> {
    const user = await this.userService.findByEmail(dto.email);

    if (user) {
      throw new RpcException('User has already exists');
    }
    const hashedPassword = await argon2.hash(dto.password);

    const createdUser = await this.userService.create({
      ...dto,
      role: EUserRole.USER,
      password: hashedPassword,
      isVerified: false,
    });

    if (!createdUser) {
      throw new BadRequestException('User creation failed');
    }
    const codeData = await this.codeService.create(
      createdUser.id,
      ECodeType.REGISTER,
    );

    const sendData: SendMessageDto = {
      message: `Your code is ${codeData.code}`,
      subject: 'Verification code',
      to: [createdUser.email],
      type: 'AUTH',
    };

    const result = await firstValueFrom<SendMessageResponseDto | undefined>(
      this.notificationClient.send(
        NOTIFICATION_PATTERNS.SEND_MESSAGE,
        sendData,
      ),
    );

    if (!result || result.status === 'error') {
      throw new BadRequestException('Sending code failed');
    }
    return result;
  }

  public async registerVerifyCode(
    dto: VerifyCodeDto,
  ): Promise<SuccessLoginDto | undefined> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValidCode = await this.codeService.checkExpiresAt(
      user.id,
      dto.code,
      ECodeType.REGISTER,
    );

    if (!isValidCode) {
      throw new BadRequestException('Invalid code');
    }

    const correctlyUser = {
      ...user,
      role: EUserRole.USER,
    };

    const accessData =
      await this.accessTokenService.signAccessToken(correctlyUser);
    const refreshData = this.refreshTokenService.generate();
    const hashedRefresh = await this.refreshTokenService.hash(
      refreshData.token,
    );

    await this.userService.update({ id: user.id, isVerified: true });

    await this.updateRefreshToken(user.id, {
      token: hashedRefresh,
      expiresAt: refreshData.expiresAt,
    });

    return { accessData, refreshData };
  }

  private async updateRefreshToken(userId: string, tokenData: TokenData) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    return await this.prisma.refreshToken.create({
      data: {
        tokenHash: tokenData.token,
        expiresAt: tokenData.expiresAt.expiresDate,
        userId,
      },
    });
  }

  public async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<SendMessageResponseDto> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('This account is not registered.');
    }

    const codeData = await this.codeService.create(
      user.id,
      ECodeType.RESET_PASSWORD,
    );

    const sendData: SendMessageDto = {
      message: `Your Reset Code is ${codeData.code}`,
      subject: 'Reset password code',
      to: [user.email],
      type: 'AUTH',
    };

    const result = await firstValueFrom<SendMessageResponseDto | undefined>(
      this.notificationClient.send(
        NOTIFICATION_PATTERNS.SEND_MESSAGE,
        sendData,
      ),
    );

    if (!result || result.status === 'error') {
      throw new BadRequestException('Sending code failed');
    }

    return result;
  }

  public async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<SendMessageResponseDto> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('This account is not registered.');
    }

    const isValidCode = await this.codeService.checkExpiresAt(
      user.id,
      dto.code,
      ECodeType.RESET_PASSWORD,
    );

    if (!isValidCode) {
      throw new BadRequestException('Invalid code');
    }

    const hashedPassword = await argon2.hash(dto.password);

    await this.userService.update({
      id: user.id,
      password: hashedPassword,
    });

    return { status: 'success' };
  }

  public async verifyAccessToken(
    dto: VerifyAccessTokenDto,
  ): Promise<SuccessLoginDto> {
    const payload = this.accessTokenService.verifyAccessToken(dto.token);
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new RpcException('User not found');
    }

    const accessData = await this.accessTokenService.signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as EUserRole,
    });

    const refreshData = this.refreshTokenService.generate();
    return { accessData, refreshData };
  }

  public getGoogleLoginUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    return `${process.env.GOOGLE_AUTH_REDIRECT_URL}?${params}`;
  }

  public async googleLogin(code: string): Promise<SuccessLoginDto> {
    const tokenResponse = await fetch(process.env.GOOGLE_TOKEN_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const googleUser: IGoogleUserResponse = await userResponse.json();
    const foundUser = await this.userService.findByEmail(googleUser.email);

    let user: UserDto;

    if (foundUser) {
      user = foundUser;
    } else {
      const createdUser = await this.userService.create({
        email: googleUser.email,
        name: googleUser.name,
        password: '',
        role: EUserRole.USER,
        isVerified: true,
      });

      if (!createdUser) {
        throw new Error('Failed to create user');
      }

      user = createdUser;
    }

    const accessData = await this.accessTokenService.signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as EUserRole,
    });

    const refreshData = this.refreshTokenService.generate();

    const hashedRefresh = await this.refreshTokenService.hash(
      refreshData.token,
    );

    await this.updateRefreshToken(user.id, {
      token: hashedRefresh,
      expiresAt: refreshData.expiresAt,
    });

    return { accessData, refreshData };
  }
}
