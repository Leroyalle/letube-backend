import { NestFactory } from '@nestjs/core';
import { ChannelModule } from './channel.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CHANNEL_HOST, CHANNEL_PORT } from '@infra';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChannelModule,
    {
      transport: Transport.TCP,
      options: { port: CHANNEL_PORT, host: CHANNEL_HOST },
    },
  );
  await app.listen();
}
bootstrap();
