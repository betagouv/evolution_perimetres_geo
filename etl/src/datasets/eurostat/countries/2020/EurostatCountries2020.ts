import { AbstractDataset } from '../../../../common/AbstractDataset';
import { streamData } from '../../../../helpers';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class EurostatCountries2020 extends AbstractDataset {
  static producer = 'eurostat';
  static dataset = 'countries';
  static year = 2020;
  static table = 'eurostat_countries_2020';

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string =
    'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([['codeiso3', ['ISO3_CODE', 'varchar']]]);

  fileType: FileTypeEnum = FileTypeEnum.Geojson;
  sheetOptions = {
    filter: 'features',
  };

  async load(): Promise<void> {
    const connection = await this.connection.connect();
    await connection.query('BEGIN TRANSACTION');
    try {
      for (const filepath of this.filepaths) {
        const cursor = streamData(filepath, this.fileType, this.sheetOptions);
        let done = false;
        do {
          const results = await cursor.next();
          done = !!results.done;
          if (results.value) {
            const query = {
              text: `
                INSERT INTO ${this.table} (
                    ${[...this.rows.keys()].join(', \n')},geom
                )
                WITH tmp as(
                  SELECT * FROM
                  json_to_recordset($1)
                  as tmp(type varchar, properties json,geometry json)
                )
                SELECT ${[...this.rows].map(([k, r]) => `(properties->>'${r[0]}')::${r[1]} AS ${k}`).join(', \n')},
                st_transform(st_multi(st_geomfromgeojson(geometry)),2154) as geom 
                FROM tmp
              `,
              values: [JSON.stringify(results.value).replace(/'/g, "''")],
            };
            await connection.query(query);
          }
        } while (!done);
      }
      await connection.query('COMMIT');
      connection.release();
    } catch (e) {
      await connection.query('ROLLBACK');
      connection.release();
      throw e;
    }
  }
}
