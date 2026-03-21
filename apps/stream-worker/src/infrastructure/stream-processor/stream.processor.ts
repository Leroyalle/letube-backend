import type { FileStoragePort } from '@app/abstractions/storage/file-storage.port';
import { FILE_STORAGE_TOKEN } from '@app/abstractions/storage/file-storage.token';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';

import { Inject, Injectable } from '@nestjs/common';

import type {
  IStoragePaths,
  StreamProcessorPort,
} from '../../application/ports/stream-processor.port';

@Injectable()
export class StreamProcessor implements StreamProcessorPort {
  constructor(@Inject(FILE_STORAGE_TOKEN) private readonly fileStorage: FileStoragePort) {}

  private locks = new Map<string, Promise<void>>();

  public async process(streamKey: string, paths: IStoragePaths) {
    const prev = this.locks.get(streamKey) ?? Promise.resolve();

    const next = prev.then(() => this._process(paths));
    this.locks.set(streamKey, next);

    await next;
  }

  public async _process(paths: IStoragePaths) {
    const base = join(process.cwd(), 'hls');
    const fullLocalSegmentPath = join(base, paths.localSegmentsPath);
    const fullLocalPlaylistPath = join(base, paths.localPlaylistPath);

    await this.handleUpload(fullLocalSegmentPath, paths);
    await this.handleUpload(fullLocalPlaylistPath, paths);
  }

  private async handleUpload(
    filepath: string,
    paths: Pick<IStoragePaths, 'storageSegmentsPath' | 'storagePlaylistPath'>,
  ) {
    try {
      // await this.waitForStableFile(filepath);
      const stream = createReadStream(filepath);
      stream.on('error', (e: any) => {
        if (e.code === 'ENOENT') return;
        throw e;
      });
      await this.fileStorage.put(
        filepath.endsWith('m3u8') ? paths.storagePlaylistPath : paths.storageSegmentsPath,
        stream,
        'public',
      );
    } catch (e: any) {
      if (e.code === 'ENOENT') return;
      throw e;
    }
  }

  private async waitForStableFile(path: string) {
    let prev = -1;

    while (true) {
      const { size } = await stat(path);

      if (size === prev) break;

      prev = size;
      await new Promise(r => setTimeout(r, 100));
    }
  }
}
