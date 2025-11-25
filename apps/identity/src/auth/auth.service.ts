import {
  EUserRole,
  LoginDto,
  RegisterDto,
  SuccessLoginDto,
  TokenData,
} from '@contracts';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AccessTokenService } from './token/services/access-token.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenService } from './token/services/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly prisma: PrismaService,
  ) {}

  public async login(dto: LoginDto): Promise<SuccessLoginDto | undefined> {
    try {
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
    } catch (error) {
      console.log('AuthService_login', error);
    }
  }

  public async register(
    dto: RegisterDto,
  ): Promise<SuccessLoginDto | undefined> {
    try {
      const user = await this.userService.findByEmail(dto.email);

      if (user) {
        throw new BadRequestException('User has already exists');
      }

      const createdUser = await this.userService.create({
        ...dto,
        role: EUserRole.USER,
      });

      if (!createdUser) {
        throw new BadRequestException('User creation failed');
      }

      const correctlyUser = {
        ...createdUser,
        role: EUserRole.USER,
      };

      const accessData =
        await this.accessTokenService.signAccessToken(correctlyUser);
      const refreshData = this.refreshTokenService.generate();
      const hashedRefresh = await this.refreshTokenService.hash(
        refreshData.token,
      );

      await this.updateRefreshToken(correctlyUser.id, {
        token: hashedRefresh,
        expiresAt: refreshData.expiresAt,
      });

      return { accessData, refreshData };
    } catch (error) {
      console.log('AuthService_register', error);
    }
  }

  private async updateRefreshToken(userId: string, tokenData: TokenData) {
    try {
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
    } catch (error) {
      console.log('AuthService_updateRefreshToken', error);
    }
  }
}
