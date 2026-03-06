import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { CodeService } from './code.service';

@Module({
  imports: [PrismaModule],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
