export interface IStoragePaths {
  segmentsPath: string;
  playlistPath: string;
}

export interface StreamProcessorPort {
  process: (streamKey: string, paths: IStoragePaths) => Promise<void>;
}
