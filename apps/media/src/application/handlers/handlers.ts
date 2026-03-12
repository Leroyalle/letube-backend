import { readHandlers } from './read/read-handlers';
import { writeHandlers } from './write/write-handlers';

export const handlers = [...readHandlers, ...writeHandlers];
