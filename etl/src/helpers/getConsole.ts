import createLogger from 'console-log-level';
import { logger } from '../config';

export function getLogger() {
  return createLogger(logger as any);
}
