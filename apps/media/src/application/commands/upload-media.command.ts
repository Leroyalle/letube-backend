import type { ContentType } from '../../domain/value-objects/content-type.vo';
import type { StorageType } from '../../domain/value-objects/storage-type.vo';

export class UploadMediaCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly filename: string,
    public readonly contentType: ContentType,
    public readonly storageType: StorageType,
  ) {}
}
