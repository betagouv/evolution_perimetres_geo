import { getTemporaryFilePath } from '.';
import mapshaper from 'mapshaper';

export async function transformGeoFile(
  filepath: string,
  format: string,
  precision: number,
  force: boolean,
  simplify?: string,
): Promise<string> {
  try {
    const outFilepath = getTemporaryFilePath();
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
    await mapshaper.runCommands(options.join(' '));
    return outFilepath;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
