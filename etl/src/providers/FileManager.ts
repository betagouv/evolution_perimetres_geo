import axios from 'axios';
import { access, mkdir } from 'fs/promises';
import { Readable } from 'stream';
import mapshaper from 'mapshaper';
import { basename, join } from 'path';
import {
  writeFile,
  hash,
  randomString,
  unzipFile,
  ungzFile,
  un7zFile,
  getAllFiles,
  getFileExtensions,
} from '../helpers';

import { FileManagerConfigInterface, ArchiveFileTypeEnum, FileTypeEnum } from '../interfaces';

export class FileManager {
  readonly basePath: string;
  constructor(config: FileManagerConfigInterface) {
    this.basePath = config.basePath;
  }

  protected getTemporaryDirectoryPath(name?: string): string {
    return name ? join(this.basePath, name) : this.getTemporaryFilePath();
  }

  protected getTemporaryFilePath(data?: string): string {
    return join(this.basePath, data ? hash(data) : randomString());
  }

  async decompress(filepath: string, archiveType: ArchiveFileTypeEnum, fileType: FileTypeEnum): Promise<string[]> {
    try {
      await access(filepath);
      const extractPath = this.getTemporaryDirectoryPath(`${basename(filepath)}-extract`);
      try {
        await access(extractPath);
      } catch {
        // If directory not found, create it and decompress
        await mkdir(extractPath);
        switch (archiveType) {
          case ArchiveFileTypeEnum.Zip:
            await unzipFile(filepath, extractPath);
            break;
          case ArchiveFileTypeEnum.GZip:
            await ungzFile(filepath, extractPath);
            break;
          case ArchiveFileTypeEnum.SevenZip:
            await un7zFile(filepath, extractPath);
            break;
          case ArchiveFileTypeEnum.None:
            break;
          default:
            throw new Error();
        }
      }
      const files: Set<string> = new Set();
      await getAllFiles(extractPath, getFileExtensions(fileType), files);
      return [...files];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async download(url: string): Promise<string> {
    const filepath = this.getTemporaryFilePath(url);
    try {
      await access(filepath);
    } catch {
      // If file not found download it !
      const response = await axios.get<Readable>(url, { responseType: 'stream' });
      await writeFile(response.data, filepath);
    }
    return filepath;
  }

  async transform(
    filepath: string,
    format: string,
    precision: number,
    force: boolean,
    simplify?: string,
  ): Promise<string> {
    try {
      const outFilepath = `${this.getTemporaryFilePath()}.${format}`;
      const options = [
        '-i',
        filepath,
        simplify || '',
        '-o',
        force ? 'force' : '',
        outFilepath,
        `format=${format}`,
        `precision=${precision}`,
      ];
      console.debug(`Running mapshaper with options ${options.join(' ')}`);
      await mapshaper.runCommands(options.join(' '));
      return outFilepath;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
