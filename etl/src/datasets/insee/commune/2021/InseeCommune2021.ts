import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseeCommune2021 extends AbstractDataset {
  static dataset = 'insee_commune';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/commune2021-csv.zip';
  readonly fileType: FileTypeEnum = FileTypeEnum.Csv;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly table: string = 'insee_com_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['typecom', ['0', 'varchar']],
    ['com', ['1', 'varchar']],
    ['reg', ['2', 'varchar']],
    ['dep', ['3', 'varchar']],
    ['ctcd', ['4', 'varchar']],
    ['arr', ['5', 'varchar']],
    ['tncc', ['6', 'varchar']],
    ['ncc', ['7', 'varchar']],
    ['nccenr', ['8', 'varchar']],
    ['libelle', ['9', 'varchar']],
    ['can', ['10', 'varchar']],
    ['comparent', ['11', 'varchar']],
  ]);

  sheetOptions = {};

  async import(): Promise<void> {
    // TODO
  }
}
