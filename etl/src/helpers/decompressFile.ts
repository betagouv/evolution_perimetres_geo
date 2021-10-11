import extract from 'extract-zip';
import { createGunzip } from 'zlib';
import { extractFull } from 'node-7z';
import { createReadStream, createWriteStream } from 'fs';
import { access, mkdir } from 'fs/promises';
import { basename } from 'path';

import { ArchiveFileTypeEnum, FileTypeEnum } from '../interfaces';
import { getTemporaryDirectoryPath } from '.';
import { getAllFiles } from './getAllFiles';
import { getFileExtensions } from './getFileExtension';

function unzipFile(filepath: string, extractPath: string): Promise<void> {
  return extract(filepath, { dir: extractPath });
}

function ungzFile(filepath: string, extractPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fileContents = createReadStream(filepath);
    const writeStream = createWriteStream(extractPath);
    const unzip = createGunzip();
    const file = fileContents.pipe(unzip);
    file.pipe(writeStream);
    file.on('finish', resolve);
    file.on('error', reject);
  });
}

function un7zFile(filepath: string, extractPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = extractFull(filepath, extractPath);
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

export async function decompressFile(
  filepath: string,
  archiveType: ArchiveFileTypeEnum,
  fileType: FileTypeEnum,
): Promise<string[]> {
  try {
    await access(filepath);
    const extractPath = getTemporaryDirectoryPath(`${basename(filepath)}-extract`);
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
