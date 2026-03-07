import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { FileStoragePort } from 'apps/media/src/application/storage/file-storage.port';
import { createReadStream, promises, type ReadStream } from 'fs';
import { join } from 'path';
import type { Readable } from 'stream';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ClientService implements FileStoragePort {
  public client: S3Client;
  public bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
      },
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
    });
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
  }

  public getUploadUrl(key: string) {
    const command = new PutObjectCommand({
      // TODO: добавить препапку к key
      Key: key,
      Bucket: this.bucket,
      ContentType: 'video/mp4',
    });

    const url = getSignedUrl(this.client, command, {
      expiresIn: 3600,
    });

    return url;
  }

  public async get(key: string, bucket: string = this.bucket) {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucket,
    });

    const response = await this.client.send(command);

    return response.Body as Readable;
  }

  public async put(key: string, stream: ReadStream) {
    const command = new PutObjectCommand({
      Key: key,
      Bucket: this.bucket,
      Body: stream,
    });

    const result = await this.client.send(command);
    return result;
  }

  public async uploadFolder(localPath: string, remotePrefix: string): Promise<void> {
    const files = await promises.readdir(localPath);
    const concurrency = 10;

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      await Promise.all(
        batch.map(file => {
          const stream = createReadStream(join(localPath, file));
          return this.put(`${remotePrefix}/${file}`, stream);
        }),
      );
    }
  }
}
