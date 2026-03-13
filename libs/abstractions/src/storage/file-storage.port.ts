import type { Readable } from 'stream';

type MediaStorage = 'public' | 'private';

export interface FileStoragePort {
  getUploadUrl: (key: string, storage: MediaStorage) => Promise<string>;
  get: (key: string, storage: MediaStorage) => Promise<Readable | undefined>;
  put: (key: string, stream: Readable, storage: MediaStorage) => Promise<void>;
  exists: (key: string, storage: MediaStorage) => Promise<boolean>;
  uploadFolder: (localPath: string, remotePrefix: string, storage: MediaStorage) => Promise<void>;
}
