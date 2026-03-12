import { ContentType as ContentTypeEnum } from '@contracts/media/enums/content-type.enum';

// type ContentTypeValue = 'video' | 'image';
export class ContentType {
  private constructor(private readonly value: ContentTypeEnum) {}

  public static from(value: ContentTypeEnum) {
    // if (!this.isValid(value)) throw new Error('Invalid content type');
    return new ContentType(value);
  }

  // private static isValid(value: ContentTypeEnum): value is ContentTypeValue {
  //   return ['video', 'image'].includes(value);
  // }

  public getValue() {
    return this.value;
  }
}
