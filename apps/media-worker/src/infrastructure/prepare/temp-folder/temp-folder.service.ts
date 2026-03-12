import { mkdir, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { Injectable } from '@nestjs/common';

import type { TempFolderPort } from '../../../application/ports/temp-folder.port';
import type { ContentType } from '../../../domain/value-objects/content-type.vo';

import type { TempWorkspace } from './temp-workspace.type';

@Injectable()
export class TempFolderService implements TempFolderPort {
  public async prepare(key: string, content: ContentType) {
    const root = join(tmpdir(), 'media-worker', content.getValue(), key);

    const inputDir = join(root, 'input');
    const outputDir = join(root, 'hls');

    await mkdir(inputDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    return {
      root,
      inputDir,
      outputDir,
    };
  }

  public async cleanup(workspace: TempWorkspace) {
    await rm(workspace.root, { recursive: true, force: true });
  }
}
