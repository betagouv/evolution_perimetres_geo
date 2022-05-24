import { extractFull } from 'node-7z';
import { path7x } from '7zip-bin';

export function un7zFile(filepath: string, extractPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = extractFull(filepath, extractPath, { $bin: path7x });
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}
