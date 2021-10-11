import path from 'path';
import { hash, randomString } from '.';
import { temporaryDirectory } from '../config';

export function getTemporaryDirectoryPath(name?: string): string {
  return name ? path.join(temporaryDirectory, name) : getTemporaryFilePath();
}

export function getTemporaryFilePath(data?: string): string {
  return path.join(temporaryDirectory, data ? hash(data) : randomString());
}
