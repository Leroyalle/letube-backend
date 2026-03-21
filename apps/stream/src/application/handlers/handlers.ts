import { CreateStreamKeyHandler } from './create-stream-key.handler';
import { PublishStreamHandler } from './publish-stream.handler';
import { StopStreamHandler } from './stop-stream.handler';

export const handlers = [CreateStreamKeyHandler, PublishStreamHandler, StopStreamHandler];
