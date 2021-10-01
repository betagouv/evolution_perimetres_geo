import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseeDep2021 extends AbstractDataset {
  static dataset = 'insee_dep';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/departement2021-csv.zip';
  readonly fileType: FileTypeEnum = FileTypeEnum.Csv;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly table: string = 'insee_dep_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['dep', ['0', 'varchar']],
    ['reg', ['1', 'varchar']],
    ['chef_lieu', ['2', 'varchar']],
    ['tncc', ['3', 'varchar']],
    ['ncc', ['4', 'varchar']],
    ['nccenr', ['5', 'varchar']],
    ['libelle', ['6', 'varchar']]
  ]);
  sheetOptions = {};

  async import(): Promise<void> {
    // TODO
  }
}
