import extract from 'extract-zip';
import { createGunzip } from 'zlib';
import { extractFull } from 'node-7z';
import { createReadStream, createWriteStream } from 'fs';
import { access, readdir } from 'fs/promises';
import path from 'path';

import { ArchiveFileTypeEnum } from '../interfaces';
import { getTemporaryDirectoryPath } from '.';

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

export async function decompressFile(filepath: string, archiveType: ArchiveFileTypeEnum): Promise<string[]> {
  try {
    const extractPath = await getTemporaryDirectoryPath();
    await access(filepath);
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
    const paths = await readdir(extractPath);
    return paths.map((p) => path.join(extractPath, p));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
