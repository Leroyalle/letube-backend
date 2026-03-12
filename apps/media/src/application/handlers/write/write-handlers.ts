import { MarkMediaAsProcessedHandler } from './mark-media-as-processed.handler';
import { UploadCompleteHandler } from './upload-complete.handler';
import { UploadMediaHandler } from './upload-media.handler';

export const writeHandlers = [
  UploadMediaHandler,
  UploadCompleteHandler,
  MarkMediaAsProcessedHandler,
];
