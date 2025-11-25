import { Module } from '@nestjs/common';
import { AccessTokenService } from './services/access-token.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './services/refresh-token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AccessTokenService, RefreshTokenService],
  exports: [AccessTokenService, RefreshTokenService],
})
export class TokenModule {}
