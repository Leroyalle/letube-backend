import { FindAllHandler } from './find-all.handler';
import { FindByIdHandler } from './find-by-id.handler';
import { FindByUserIdHandler } from './find-by-user-id.handler';

export const queryHandlers = [FindByUserIdHandler, FindByIdHandler, FindAllHandler];
