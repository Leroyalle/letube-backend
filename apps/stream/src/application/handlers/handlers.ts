import { CreateStreamKeyHandler } from './create-stream-key.handler';
import { PublishStreamHandler } from './publish-stream.handler';
import { PutHlsInQueueHandler } from './put-hls-in-queue.handler';
import { StopStreamHandler } from './stop-stream.handler';

export const handlers = [
  CreateStreamKeyHandler,
  PublishStreamHandler,
  StopStreamHandler,
  PutHlsInQueueHandler,
];
