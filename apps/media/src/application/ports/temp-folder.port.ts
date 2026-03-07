export interface TempFolderPort {
  prepare: (key: string) => {
    inputDir: string;
    outputDir: string;
  };
}
