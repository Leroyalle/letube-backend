import type { ContentType } from '../../domain/value-objects/content-type.vo';

export type TempWorkspace = {
  root: string;
  inputDir: string;
  outputDir: string;
};

export interface TempFolderPort {
  prepare: (key: string, content: ContentType) => Promise<TempWorkspace>;
  cleanup: (workspace: TempWorkspace) => Promise<void>;
}
