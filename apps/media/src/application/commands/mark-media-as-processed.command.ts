import type { ContentType } from '../../domain/value-objects/content-type.vo';

export class MarkMediaAsProcessedCommand {
  constructor(
    public readonly sourceId: string,
    public readonly contentType: ContentType,
    public readonly hlsMasterKey: string,
  ) {}
}
