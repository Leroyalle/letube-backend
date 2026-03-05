import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ClientService {
  public client: S3Client;
  public bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
    });
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
  }

  public getUploadUrl(key: string) {
    const command = new PutObjectCommand({
      Key: key,
      Bucket: this.bucket,
      ContentType: 'video/mp4',
    });

    const url = getSignedUrl(this.client, command, {
      expiresIn: 3600,
    });

    return url;
  }
}
