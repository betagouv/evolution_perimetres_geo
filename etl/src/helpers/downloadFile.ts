import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import { access } from 'fs/promises';
import { getTemporaryFilePath } from '.';

export function writeFile(response: AxiosResponse, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    response.data.pipe(file);
    file.on('finish', resolve);
    file.on('error', reject);
  });
}

export async function downloadFile(url: string): Promise<string> {
  const filepath = getTemporaryFilePath(url);
  try {
    await access(filepath);
  } catch {
    // If file not found download it !
    const response = await axios.get(url, { responseType: 'stream' });
    await writeFile(response, filepath);
  }
  return filepath;
}
