import type { FileStoragePort } from '@app/abstractions/storage/file-storage.port';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createReadStream, promises } from 'fs';
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
      requestChecksumCalculation: 'WHEN_REQUIRED',
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
    });
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);

      return true;
    } catch (error: any) {
      if (error?.$metadata?.httpStatusCode === 404) {
        return false;
      }

      throw error;
    }
  }

  public async getUploadUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Key: key,
      Bucket: this.bucket,
      // FIXME: передавать контейнттайп чтобы при реквесте загрузить видео не передали фото
      // ContentType: 'video/mp4',
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: 3600,
    });
  }

  public async get(key: string, bucket: string = this.bucket) {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucket,
    });

    const response = await this.client.send(command);

    if (!response.Body) return undefined;

    return response.Body as Readable;
  }

  public async put(key: string, stream: Readable) {
    const command = new PutObjectCommand({
      Key: key,
      Bucket: this.bucket,
      Body: stream,
    });

    await this.client.send(command);
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
