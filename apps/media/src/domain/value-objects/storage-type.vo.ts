export class StorageType {
  constructor(private readonly type: 'private' | 'public') {}

  public getValue() {
    return this.type;
  }
}
