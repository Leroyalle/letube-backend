type ContentTypeValue = 'video' | 'image';
export class ContentType {
  private constructor(private readonly value: 'video' | 'image') {}

  public static from(value: string) {
    if (!this.isValid(value)) throw new Error('Invalid content type');
    return new ContentType(value);
  }

  private static isValid(value: string): value is ContentTypeValue {
    return ['video', 'image'].includes(value);
  }

  public getValue() {
    return this.value;
  }
}
