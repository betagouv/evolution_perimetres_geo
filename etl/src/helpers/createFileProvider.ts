import { FileProviderConfigInterface } from '../interfaces';
import { config } from '../config';
import { FileProvider } from '../providers/FileProvider';

export function createFileProvider(fileConfig: FileProviderConfigInterface = config.file): FileProvider {
  return new FileProvider(fileConfig);
}
