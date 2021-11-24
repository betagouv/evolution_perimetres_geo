import { FileManagerConfigInterface, FileManagerInterface } from '../interfaces';
import { config } from '../config';
import { FileManager } from '../providers';

export function createFileManager(fileConfig: FileManagerConfigInterface = config.file): FileManagerInterface {
  return new FileManager(fileConfig);
}
