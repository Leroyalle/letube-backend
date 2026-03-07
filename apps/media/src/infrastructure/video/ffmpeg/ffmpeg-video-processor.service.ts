import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { type Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { Injectable } from '@nestjs/common';

import type { VideoProcessorPort } from '../../../application/video/video-processor.port';

@Injectable()
export class FfmpegVideoProcessor implements VideoProcessorPort {
  public async cup(inputPath: string, outputPath: string, source: Readable) {
    const fileStream = createWriteStream(inputPath);

    await pipeline(source, fileStream);

    return await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn(
        'C:\\Users\\nikol\\Downloads\\ffmpeg-2026-03-05-git-74cfcd1c69-essentials_build\\ffmpeg-2026-03-05-git-74cfcd1c69-essentials_build\\bin\\ffmpeg.exe',
        [
          '-i',
          inputPath,
          '-f',
          'hls',
          '-hls_segment_filename',
          `${inputPath}/segment%03d.ts`,
          outputPath,
        ],
      );

      ffmpeg.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });

      ffmpeg.on('error', reject);
    });
  }
}
