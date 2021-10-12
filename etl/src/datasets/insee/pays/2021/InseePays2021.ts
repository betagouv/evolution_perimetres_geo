import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseePays2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'pays';
  static year = 2021;
  static table: string = 'insee_pays_2021';

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/pays2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
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

  readonly importSql = `
    INSERT INTO ${this.targetTable} (
      year,
      centroid,
      geom,
      geom_simple,
      arr,
      country,
      l_country
    ) SELECT
      2021 as year,
      ST_PointOnSurface(st_transform(b.geom,2154)) as centroid,
      st_transform(b.geom,2154) as geom,
      st_transform(b.geom,2154) as geom_simple,
      a.cog,
      a.cog,
      a.libcog
    FROM ${this.table} a
    LEFT JOIN  eurostat_countries_2020 b
    ON a.codeiso3 = b.codeiso3;
  `;
}
