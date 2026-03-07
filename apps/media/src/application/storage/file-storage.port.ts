import type { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import type { ReadStream } from 'fs';
import type { Readable } from 'stream';

export interface FileStoragePort {
  getUploadUrl: (key: string) => Promise<string>;
  get: (key: string) => Promise<Readable | undefined>;
  put: (key: string, stream: ReadStream) => Promise<PutObjectCommandOutput>;
  uploadFolder: (localPath: string, remotePrefix: string) => Promise<void>;
}
