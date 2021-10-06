import ora, { Options } from 'ora';
import { spinner } from '../config';

export function getSpinner(config: Options = spinner) {
  const spinner = ora(config);
  return spinner;
}
