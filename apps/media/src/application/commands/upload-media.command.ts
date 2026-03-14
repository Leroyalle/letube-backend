import type { ContentType } from '../../domain/value-objects/content-type.vo';
import type { Visibility } from '../../domain/value-objects/visibility.vo';

export class UploadMediaCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly filename: string,
    public readonly contentType: ContentType,
    public readonly visibility: Visibility,
  ) {}
}
