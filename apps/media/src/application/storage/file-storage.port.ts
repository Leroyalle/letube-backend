export interface FileStoragePort {
  getUploadUrl: (key: string) => Promise<string>;
}
