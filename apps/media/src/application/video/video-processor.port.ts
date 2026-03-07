import type { Readable } from 'stream';

export interface VideoProcessorPort {
  cup: (input: string, output: string, source: Readable) => Promise<void>;
}
