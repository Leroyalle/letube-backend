import { UploadCompleteHandler } from './upload-complete.handler';
import { UploadMediaHandler } from './upload-media.handler';

export const commandHandlers = [UploadMediaHandler, UploadCompleteHandler];
