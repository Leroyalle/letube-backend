export interface IStoragePaths {
  storageSegmentsPath: string;
  storagePlaylistPath: string;
  localPlaylistPath: string;
  localSegmentsPath: string;
}

export interface StreamProcessorPort {
  process: (streamKey: string, paths: IStoragePaths) => Promise<void>;
}
