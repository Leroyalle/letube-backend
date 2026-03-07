import type { ContentType } from '../../domain/value-objects/content-type.vo';

export class UploadMediaCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly channelId: string,
    public readonly filename: string,
    public readonly contentType: ContentType,
  ) {}
}
