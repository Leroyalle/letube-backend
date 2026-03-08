import type { ContentType } from '../../domain/value-objects/content-type.vo';

export class UploadCompleteCommand {
  constructor(
    public readonly sourceId: string,
    public readonly contentType: ContentType,
  ) {}
}
