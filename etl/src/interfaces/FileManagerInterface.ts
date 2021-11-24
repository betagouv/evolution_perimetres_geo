import { ArchiveFileTypeEnum, FileTypeEnum } from '.';

export interface FileManagerInterface {
  decompress(filepath: string, archiveType: ArchiveFileTypeEnum, fileType: FileTypeEnum): Promise<string[]>;
  download(url: string): Promise<string>;
  transform(filepath: string, format: string, precision: number, force: boolean, simplify?: string): Promise<string>;
}
