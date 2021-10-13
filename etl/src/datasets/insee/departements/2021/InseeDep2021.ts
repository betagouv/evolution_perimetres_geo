import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class InseeDep2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'dep';
  static year = 2021;
  static table = 'insee_dep_2021';

  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/departement2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly rows: Map<string, [string, string]> = new Map([
    ['dep', ['0', 'varchar(3)']],
    ['reg', ['1', 'varchar(2)']],
    ['chef_lieu', ['2', 'varchar(5)']],
    ['tncc', ['3', 'varchar']],
    ['ncc', ['4', 'varchar']],
    ['nccenr', ['5', 'varchar']],
    ['libelle', ['6', 'varchar']],
  ]);

  readonly extraBeforeSql = `ALTER TABLE ${this.tableWithSchema} ALTER COLUMN dep SET NOT NULL;`;

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  readonly tableIndex = 'dep';
  readonly importSql = `
    UPDATE ${this.targetTable}
      SET l_dep = t.libelle
    FROM ${this.tableWithSchema} t
    WHERE dep = t.dep;
  `;
}
