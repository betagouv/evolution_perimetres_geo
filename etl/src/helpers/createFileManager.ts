import { FileManagerConfigInterface } from '../interfaces';
import { config } from '../config';
import { FileManager } from '../providers';

export function createFileManager(fileConfig: FileManagerConfigInterface = config.file): FileManager {
  return new FileManager(fileConfig);
}
