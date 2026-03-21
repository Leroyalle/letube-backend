import { SharedAuthModule } from '@app/modules';

import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { StreamModule } from './stream/stream.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, MediaModule, SharedAuthModule, StreamModule],
})
export class AppGatewayModule {}
