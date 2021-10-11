import mapshaper from 'mapshaper';
import { getTemporaryFilePath } from '.';

export async function transformGeoFile(
  filepath: string,
  format: string,
  precision: number,
  force: boolean,
  simplify?: string,
): Promise<string> {
  try {
    const outFilepath = `${getTemporaryFilePath()}.${format}`;
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
