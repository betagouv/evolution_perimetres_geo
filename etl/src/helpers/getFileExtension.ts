import { FileTypeEnum } from '../interfaces';

export function getFileExtensions(filetype: FileTypeEnum): string[] {
  switch (filetype) {
    case FileTypeEnum.Csv:
      return ['.csv'];
    case FileTypeEnum.Ods:
      return ['.ods'];
    case FileTypeEnum.Xls:
      return ['.xls', '.xlsx'];
    case FileTypeEnum.Geojson:
      return ['.json', '.geojson'];
    default:
      throw new Error('Unknown file type');
  }
}
