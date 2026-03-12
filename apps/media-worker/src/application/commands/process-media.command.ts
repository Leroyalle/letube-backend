import type { ContentType } from '../../domain/value-objects/content-type.vo';

export class ProcessMediaCommand {
  constructor(
    public readonly sourceKey: string,
    public readonly sourceId: string,
    public readonly contentType: ContentType,
  ) {}
}
