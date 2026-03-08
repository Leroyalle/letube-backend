import type { ContentType } from '../../domain/value-objects/content-type.vo';

export interface TempFolderPort {
  prepare: (
    key: string,
    content: ContentType,
  ) => {
    inputDir: string;
    outputDir: string;
  };
}
