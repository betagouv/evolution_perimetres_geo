import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class InseePerim2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'perim';
  static year = 2021;
  static table = 'insee_perim_2021';

  readonly url: string =
    'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2021.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly rows: Map<string, [string, string]> = new Map([
    ['codgeo', ['CODGEO', 'varchar(5)']],
    ['libgeo', ['LIBGEO', 'varchar']],
    ['epci', ['EPCI', 'varchar(9)']],
    ['libepci', ['LIBEPCI', 'varchar']],
    ['dep', ['DEP', 'varchar(3)']],
    ['reg', ['REG', 'varchar(2)']],
  ]);
  readonly extraBeforeSql = `ALTER TABLE ${this.table} 
    ALTER COLUMN codgeo SET NOT NULL,
    ADD CONSTRAINT codgeo_unique UNIQUE (codgeo);
  `;

  fileType: FileTypeEnum = FileTypeEnum.Xls;
  sheetOptions = {
    name: 'Composition_communale',
    startRow: 5,
  };

  readonly importSql = `
    UPDATE ${this.targetTable} SET
      l_arr = t.libgeo,
      com = t.codgeo,
      l_com = t.libgeo,
      epci = t.epci,
      l_epci = t.libepci,
      dep = t.dep,
      reg = t.reg
    FROM ${this.table} AS t
    WHERE year = 2021
    AND arr = t.codgeo;
  `;
}
