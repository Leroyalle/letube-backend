import { FILE_STORAGE_TOKEN } from '@app/abstractions/storage/file-storage.token';

import { Module } from '@nestjs/common';

import { S3ClientService } from './s3-client.service';

@Module({
  providers: [S3ClientService, { provide: FILE_STORAGE_TOKEN, useExisting: S3ClientService }],
  exports: [FILE_STORAGE_TOKEN],
})
export class S3Module {}
