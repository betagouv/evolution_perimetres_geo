import { getTemporaryFilePath } from '.';
import mapshaper from 'mapshaper';

export async function transformGeoFile(
  filepath: string,
  name: string,
  format: string,
  precision: number,
  force: boolean,
  simplify?: string,
): Promise<string> {
  try {
    let outFilepath: string;
    if (force) {
      outFilepath = filepath;
    } else {
      outFilepath = `${getTemporaryFilePath()}/${name}.${format}`;
    }
    if (simplify) {
      if (force) {
        await mapshaper.runCommands(
          `-i ${filepath} ${simplify} -o force ${outFilepath} format=${format} precision=${precision}`,
        );
      } else {
        await mapshaper.runCommands(
          `-i ${filepath} ${simplify} -o ${outFilepath} format=${format} precision=${precision}`,
        );
      }
    } else {
      await mapshaper.runCommands(`-i ${filepath} -o ${outFilepath} format=${format} precision=${precision}`);
    }
    return outFilepath;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
