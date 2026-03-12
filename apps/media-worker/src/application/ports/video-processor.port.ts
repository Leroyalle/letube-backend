import type { Readable } from 'stream';

export interface VideoProcessorPort {
  cut: (input: string, output: string, source: Readable) => Promise<void>;
}
