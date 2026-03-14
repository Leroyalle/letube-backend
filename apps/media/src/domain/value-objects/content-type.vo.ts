import { ContentType as ContentTypeEnum } from '@contracts/media/enums/content-type.enum';

export class ContentType {
  private constructor(private readonly value: ContentTypeEnum) {}

  public static from(value: ContentTypeEnum) {
    return new ContentType(value);
  }

  public getValue() {
    return this.value;
  }
}
