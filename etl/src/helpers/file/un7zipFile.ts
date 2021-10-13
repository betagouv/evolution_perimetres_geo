import { extractFull } from 'node-7z';

export function un7zFile(filepath: string, extractPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = extractFull(filepath, extractPath);
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}
