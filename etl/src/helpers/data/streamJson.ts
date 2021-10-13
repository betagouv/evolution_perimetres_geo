import { createReadStream } from 'fs';
import { JsonOptions } from '../interfaces';
import { withParser } from 'stream-json/filters/Pick';
import { streamArray } from 'stream-json/streamers/StreamArray';

export async function* streamJson<T>(filepath: string, sheetOptions: JsonOptions, chunkSize = 100): AsyncIterable<T[]> {
  const pipe = createReadStream(filepath, { encoding: 'utf-8' }).pipe(withParser(sheetOptions)).pipe(streamArray());

  let chunk: T[] = [];
  for await (const line of pipe) {
    if (chunk.length === chunkSize) {
      yield chunk;
      chunk = [];
    }
    chunk.push(line);
  }
  yield chunk;

  return;
}
