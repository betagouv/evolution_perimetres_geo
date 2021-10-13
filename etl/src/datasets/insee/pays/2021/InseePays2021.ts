import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class InseePays2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'pays';
  static year = 2021;
  static table = 'insee_pays_2021';

  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/pays2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly rows: Map<string, [string, string]> = new Map([
    ['cog', ['0', 'varchar(5)']],
    ['actual', ['1', 'varchar(1)']],
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
  readonly extraBeforeSql = `ALTER TABLE ${this.tableWithSchema} ALTER COLUMN cog SET NOT NULL;`;

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  readonly importSql = `
    INSERT INTO ${this.targetTable} (
      year,
      centroid,
      geom,
      geom_simple,
      surface,
      arr,
      l_arr,
      country,
      l_country
    ) SELECT
      2021 as year,
      ST_PointOnSurface(st_transform(t.geom,2154)) as centroid,
      st_transform(t.geom,2154) as geom,
      st_transform(t.geom,2154) as geom_simple,
      st_area(geom) as surface,
      a.cog,
      a.libcog,
      a.cog,
      a.libcog
    FROM ${this.tableWithSchema} a
    LEFT JOIN  eurostat_countries_2020 t
    ON a.codeiso3 = t.codeiso3;
  `;
}
