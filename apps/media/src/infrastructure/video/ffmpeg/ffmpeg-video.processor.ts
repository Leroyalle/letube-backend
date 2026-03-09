import {
  HLS_PLAYLIST_NAME,
  HLS_SEGMENT_NAME,
} from 'apps/media/src/application/constants/hls.constant';
import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { type Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { Injectable } from '@nestjs/common';

import type { VideoProcessorPort } from '../../../application/ports/video-processor.port';

@Injectable()
export class FfmpegVideoProcessor implements VideoProcessorPort {
  public async cut(inputPath: string, outputPath: string, source: Readable) {
    await mkdir(inputPath, { recursive: true });
    await mkdir(outputPath, { recursive: true });

    const inputFile = `${inputPath}/input`;
    const playlist = `${outputPath}/${HLS_PLAYLIST_NAME}`;
    const segmentPath = `${outputPath}/${HLS_SEGMENT_NAME}`;

    const writeStream = createWriteStream(inputFile);
    await pipeline(source, writeStream);

    return await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn(
        'C:\\Users\\nikol\\Downloads\\ffmpeg-2026-03-05-git-74cfcd1c69-essentials_build\\ffmpeg-2026-03-05-git-74cfcd1c69-essentials_build\\bin\\ffmpeg.exe',
        ['-i', inputFile, '-f', 'hls', '-hls_segment_filename', segmentPath, playlist],
      );

      ffmpeg.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });

      ffmpeg.on('error', reject);
    });
  }
}
