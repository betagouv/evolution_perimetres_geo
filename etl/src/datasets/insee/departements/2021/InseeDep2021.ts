import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseeDep2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'dep';
  static year = 2021;
  static table = 'insee_dep_2021';

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/departement2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly rows: Map<string, [string, string]> = new Map([
    ['dep', ['0', 'varchar']],
    ['reg', ['1', 'varchar']],
    ['chef_lieu', ['2', 'varchar']],
    ['tncc', ['3', 'varchar']],
    ['ncc', ['4', 'varchar']],
    ['nccenr', ['5', 'varchar']],
    ['libelle', ['6', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  readonly importSql = `
    UPDATE ${this.targetTable} 
    SET l_dep = t.libelle
    FROM ${this.table} AS t
    WHERE dep = t.dep;
  `;
}
