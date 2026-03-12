import type { Readable } from 'stream';

export interface FileStoragePort {
  getUploadUrl: (key: string) => Promise<string>;
  get: (key: string) => Promise<Readable | undefined>;
  put: (key: string, stream: Readable) => Promise<void>;
  exists: (key: string) => Promise<boolean>;
  uploadFolder: (localPath: string, remotePrefix: string) => Promise<void>;
}
