import path from 'path';
import fs from 'fs/promises';
import { randomString } from '.';
import { temporaryDirectory } from '../config';

export async function getTemporaryDirectoryPath(name?: string): Promise<string> {
  const dirpath = name ? path.join(temporaryDirectory, name) : getTemporaryFilePath();
  await fs.mkdir(dirpath);
  return dirpath;
}

export function getTemporaryFilePath(): string {
  return path.join(temporaryDirectory, randomString());
}
