import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { randomString } from '.';


export async function getTemporaryDirectoryPath(): Promise<string> {
   const path = getTemporaryFilePath();
   await fs.mkdir(path);
   return path; 
}

export function getTemporaryFilePath(): string {
    return path.join(os.tmpdir(), randomString());
}
