import { type DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, type ClientsModuleAsyncOptions } from '@nestjs/microservices';

@Module({})
export class RabbitMQModule {
  public static registerAsync(options: ClientsModuleAsyncOptions): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [ClientsModule.registerAsync(options)],
      exports: [ClientsModule],
    };
  }
}
