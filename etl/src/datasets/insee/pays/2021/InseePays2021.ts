import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseePays2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'pays';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/pays2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly table: string = 'insee_pays_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['cog', ['0', 'varchar']],
    ['actual', ['1', 'varchar']],
    ['capay', ['2', 'varchar']],
    ['crpay', ['3', 'varchar']],
    ['ani', ['4', 'varchar']],
    ['libcog', ['5', 'varchar']],
    ['libenr', ['6', 'varchar']],
    ['ancnom', ['7', 'varchar']],
    ['codeiso2', ['8', 'varchar']],
    ['codeiso3', ['9', 'varchar']],
    ['codenum3', ['10', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  async import(): Promise<void> {
    // TODO
  }
}
