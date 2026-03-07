import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, MediaModule],
})
export class AppGatewayModule {}
