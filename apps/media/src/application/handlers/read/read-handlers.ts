import { GetAllVideosHandler } from './get-all-videos.handler';
import { GetVideoByIdHandler } from './get-video-by-id.handler';

export const readHandlers = [GetVideoByIdHandler, GetAllVideosHandler];
