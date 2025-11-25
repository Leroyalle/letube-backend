import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
