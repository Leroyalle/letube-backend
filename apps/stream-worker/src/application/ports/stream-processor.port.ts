export interface StreamProcessorPort {
  process: (streamKey: string) => Promise<void>;
}
