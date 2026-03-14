import type { FileStoragePort } from '@app/abstractions/storage/file-storage.port';
import { FILE_STORAGE_TOKEN } from '@app/abstractions/storage/file-storage.token';
import { MediaStorageResolver } from '@app/pure/media';
import { MEDIA_BROKER_QUEUES } from '@contracts/media/queues/broker.queues';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ProcessMediaCommand } from '../commands/process-media.command';
import type { BrokerEventBusPort } from '../ports/broker-event-bus.port';
import type { TempFolderPort } from '../ports/temp-folder.port';
import { BROKER_EVENT_BUS_TOKEN, TEMP_FOLDER_TOKEN, VIDEO_PROCESSOR_TOKEN } from '../ports/tokens';
import type { VideoProcessorPort } from '../ports/video-processor.port';

@CommandHandler(ProcessMediaCommand)
export class ProcessMediaHandler implements ICommandHandler<ProcessMediaCommand> {
  constructor(
    @Inject(FILE_STORAGE_TOKEN)
    private readonly fileStorageService: FileStoragePort,
    @Inject(TEMP_FOLDER_TOKEN)
    private readonly tempFolderService: TempFolderPort,
    @Inject(VIDEO_PROCESSOR_TOKEN)
    private readonly videoProcessorService: VideoProcessorPort,
    @Inject(BROKER_EVENT_BUS_TOKEN)
    private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: ProcessMediaCommand) {
    const playlistKey = MediaStorageResolver.createPlaylistKey(
      command.sourceId,
      command.contentType.getValue(),
    );

    const isExists = await this.fileStorageService.exists(
      playlistKey,
      command.visibility.getValue(),
    );

    if (isExists) return;

    const readable = await this.fileStorageService.get(
      command.sourceKey,
      command.visibility.getValue(),
    );

    if (!readable) throw new Error('Файл в хранилище не найден');

    const workspace = await this.tempFolderService.prepare(command.sourceId, command.contentType);

    try {
      await this.videoProcessorService.cut(workspace.inputDir, workspace.outputDir, readable);

      const hlsFolderKey = MediaStorageResolver.createHlsFolderKey(
        command.sourceId,
        command.contentType.getValue(),
      );

      await this.fileStorageService.uploadFolder(
        workspace.outputDir,
        hlsFolderKey,
        command.visibility.getValue(),
      );

      this.brokerEventBus.emit(MEDIA_BROKER_QUEUES.processed, {
        sourceId: command.sourceId,
        contentType: command.contentType,
        hlsMasterKey: playlistKey,
      });

      return {
        sourceId: command.sourceId,
        contentType: command.contentType,
        hlsMasterKey: playlistKey,
      };
    } finally {
      await this.tempFolderService.cleanup(workspace);
    }
  }
}
