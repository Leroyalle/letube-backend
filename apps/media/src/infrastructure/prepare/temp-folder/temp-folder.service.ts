import type { TempFolderPort } from 'apps/media/src/application/temp-folder/temp-folder.port';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TempFolderService implements TempFolderPort {
  public prepare(key: string) {
    const inputDir = `/tmp/video/${key}`;
    const outputDir = `/tmp/video/${key}.m3u8`;

    return {
      inputDir,
      outputDir,
    };
  }
}
