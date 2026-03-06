import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { UploadMediaCommand } from '../commands/upload-media.command';
import type { FileStoragePort } from '../storage/file-storage.port';
import { FILE_STORAGE_TOKEN } from '../storage/file-storage.token';

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    @Inject(FILE_STORAGE_TOKEN)
    private readonly fileStorageService: FileStoragePort,
  ) {}

  public async execute(command: UploadMediaCommand) {
    const url = await this.fileStorageService.getUploadUrl(command.filename);
    return url;
  }
}
