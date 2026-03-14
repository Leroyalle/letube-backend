import type { ContentType } from '../../domain/value-objects/content-type.vo';
import type { Visibility } from '../../domain/value-objects/visibility.vo';

export class ProcessMediaCommand {
  constructor(
    public readonly sourceKey: string,
    public readonly sourceId: string,
    public readonly contentType: ContentType,
    public readonly visibility: Visibility,
  ) {}
}
