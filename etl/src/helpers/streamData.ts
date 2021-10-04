import { FileTypeEnum, XlsxOptions, CsvOptions, JsonOptions, StreamDataOptions } from '../interfaces';
import xlsx from 'xlsx';
import { createReadStream } from 'fs';
import csvParse from 'csv-parse';
import { streamJson } from './streamJson';

async function* streamXlsx<T>(filepath: string, sheetOptions: XlsxOptions, chunkSize = 100): AsyncIterable<T[]> {
  const file = xlsx.readFile(filepath);
  const options = {
    name: 0,
    startRow: 0,
    ...sheetOptions,
  };

  const data = xlsx.utils.sheet_to_json<T>(file.Sheets[options.name], { range: options.startRow });
  while (data.length > 0) {
    const chunk = data.splice(0, chunkSize);
    yield chunk;
  }
  return;
}

async function* streamCsv<T>(filepath: string, sheetOptions: CsvOptions, chunkSize = 100): AsyncIterable<T[]> {
  const fsStream = createReadStream(filepath, { encoding: 'utf-8' });
  const parser = csvParse({
    columns: (header) => Object.keys(header).map((k) => k.toLowerCase()),
    ...sheetOptions,
  });
  fsStream.pipe(parser);
  let chunk: T[] = [];
  for await (const line of parser) {
    if (chunk.length === chunkSize) {
      yield chunk;
      chunk = [];
    }
    chunk.push(line);
  }
  yield chunk;
  return;
}

export function streamData<T>(
  filepath: string,
  filetype: FileTypeEnum,
  sheetOptions: StreamDataOptions,
  chunkSize = 100,
): any {
  switch (filetype) {
    case FileTypeEnum.Ods:
    case FileTypeEnum.Xls:
      return streamXlsx<T>(filepath, sheetOptions as XlsxOptions, chunkSize);
    case FileTypeEnum.Csv:
      return streamCsv<T>(filepath, sheetOptions as CsvOptions, chunkSize);
    case FileTypeEnum.Geojson:
      return streamJson(filepath, sheetOptions as JsonOptions, chunkSize);
    default:
      throw new Error();
  }
}
