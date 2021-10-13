import { Console } from 'console';
import { config as defaultConfig } from '../config';

export function getLogger(config = defaultConfig.logger): Console {
  const logger = new Console({ stdout: process.stdout, stderr: process.stderr });
  const rewrite = ['log', 'debug', 'info', 'warn', 'error'];
  const noop = () => {};
  const index = rewrite.indexOf(config.level);
  const splice = rewrite.splice(0, index);
  return splice.reduce((obj, k) => {
    obj[k] = noop;
    return obj;
  }, logger);
}
