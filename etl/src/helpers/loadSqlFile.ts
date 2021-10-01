import fs from 'fs/promises';

export async function loadSqlFile(path: string): Promise<string> {
  console.debug(`Loading SQL file ${path}`);
  return fs.readFile(path, { encoding: 'utf-8' });
}
