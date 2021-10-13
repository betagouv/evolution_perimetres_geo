import path from 'path';
import { hash, randomString } from '.';
import { config as defaultConfig } from '../config';

export function getTemporaryDirectoryPath(name?: string, tmpPath: string = defaultConfig.temporaryDirectory): string {
  return name ? path.join(tmpPath, name) : getTemporaryFilePath(undefined, tmpPath);
}

export function getTemporaryFilePath(data?: string, tmpPath: string = defaultConfig.temporaryDirectory): string {
  return path.join(tmpPath, data ? hash(data) : randomString());
}
