import type { TempFolderPort } from 'apps/media/src/application/ports/temp-folder.port';
import type { ContentType } from 'apps/media/src/domain/value-objects/content-type.vo';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TempFolderService implements TempFolderPort {
  public prepare(key: string, content: ContentType) {
    const inputDir = `/tmp/${content.getValue()}/${key}/input`;
    const outputDir = `/tmp/${content.getValue()}/${key}/hls`;

    return {
      inputDir,
      outputDir,
    };
  }
}
