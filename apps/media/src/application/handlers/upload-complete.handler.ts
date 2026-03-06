import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { UploadCompleteCommand } from '../commands/upload-complete.command';
import type { FileStoragePort } from '../storage/file-storage.port';
import { createReadStream, createWriteStream, promises } from 'fs';
import { pipeline } from 'stream/promises';
import { spawn } from 'child_process';
import { join } from 'path';

// TODO: вынести в воркер
@CommandHandler(UploadCompleteCommand)
export class UploadCompleteHandler
  implements ICommandHandler<UploadCompleteCommand>
{
  constructor(private readonly fileStorageService: FileStoragePort) {}
  public async execute(command: UploadCompleteCommand) {
    const inputPath = `/tmp/video/${command.s3Key}`;
    const outputPath = `/tmp/video/${command.s3Key}.m3u8`;
    const readable = await this.fileStorageService.get(command.s3Key);

    if (!readable) return;

    const fileStream = createWriteStream(inputPath);

    await pipeline(readable, fileStream);

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn(
        'C:\\Users\\nikol\\Downloads\\ffmpeg-2026-03-05-git-74cfcd1c69-essentials_build\\ffmpeg-2026-03-05-git-74cfcd1c69-essentials_build\\bin\\ffmpeg.exe',
        [
          '-i',
          inputPath,
          '-f',
          'hls',
          '-hls_segment_filename',
          `/tmp/video/${command.s3Key}/segment%03d.ts`,
          outputPath,
        ],
      );

      ffmpeg.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });

      ffmpeg.on('error', reject);
    });

    const files = await promises.readdir(`/tmp/video/${command.s3Key}`);

    const concurrency = 10;

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);

      await Promise.all(
        batch.map(async (file) => {
          const pathFile = join('/temp/video', command.s3Key, file);
          const stream = createReadStream(pathFile);
          await this.fileStorageService.put(command.s3Key, stream);
        }),
      );
    }
  }
}
