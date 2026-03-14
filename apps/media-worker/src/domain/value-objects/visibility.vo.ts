const visibilityTypes = ['private', 'public'] as const;
type VisibilityType = (typeof visibilityTypes)[number];

function isVisibilityType(value: string): value is VisibilityType {
  return visibilityTypes.includes(value as VisibilityType);
}

export class Visibility {
  constructor(private readonly type: VisibilityType) {}

  public static from(type: string) {
    if (!isVisibilityType(type)) {
      throw new Error('Invalid visibility');
    }

    return new Visibility(type);
  }

  public getValue() {
    return this.type;
  }
}
