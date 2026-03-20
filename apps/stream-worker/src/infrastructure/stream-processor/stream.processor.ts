import type { FileStoragePort } from '@app/abstractions/storage/file-storage.port';
import { FILE_STORAGE_TOKEN } from '@app/abstractions/storage/file-storage.token';
import { createReadStream } from 'fs';
import { stat, watch } from 'fs/promises';
import pLimit from 'p-limit';
import { join } from 'path';

import { Inject, Injectable } from '@nestjs/common';

import type {
  IStoragePaths,
  StreamProcessorPort,
} from '../../application/ports/stream-processor.port';

@Injectable()
export class StreamProcessor implements StreamProcessorPort {
  constructor(@Inject(FILE_STORAGE_TOKEN) private readonly fileStorage: FileStoragePort) {}

  public async process(streamKey: string, paths: IStoragePaths) {
    const limit = pLimit(5);
    const dir = join(process.cwd(), 'hls', 'live', streamKey);

    for await (const event of watch(dir)) {
      const file = event.filename;

      if (!file || !file.endsWith('.ts')) continue;
      const filepath = join(dir, file);

      void limit(() => void this.handleUpload(filepath, paths));
    }
  }

  private async handleUpload(filepath: string, paths: IStoragePaths) {
    await this.waitForStableFile(filepath);
    const stream = createReadStream(filepath);
    await this.fileStorage.put(
      filepath.endsWith('m3u8') ? paths.playlistPath : paths.segmentsPath,
      stream,
      'public',
    );
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
