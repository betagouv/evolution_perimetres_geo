import { readdir, stat } from 'fs/promises';
import { extname, join } from 'path';

export async function getAllFiles(baseDirectory: string, extensions: string[]): Promise<Set<string>> {
  let setOfFiles: Set<string> = new Set();
  const files = await readdir(baseDirectory);
  for await (const file of files) {
    const filepath = join(baseDirectory, file);
    console.debug(filepath);
    const filestat = await stat(filepath);
    if (filestat.isDirectory()) {
      setOfFiles = new Set(...setOfFiles, ...(await getAllFiles(filepath, extensions)));
    } else if (extensions.indexOf(extname(filepath)) >= 0) {
      setOfFiles.add(filepath);
    }
  }
  return setOfFiles;
}
