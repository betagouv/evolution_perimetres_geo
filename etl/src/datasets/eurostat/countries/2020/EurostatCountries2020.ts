import { AbstractDataset } from '../../../../common/AbstractDataset';
import { streamData } from '../../../../helpers';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class EurostatCountries2020 extends AbstractDataset {
  static dataset = 'eurostat_countries';
  static year = 2020;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson';
  readonly fileType: FileTypeEnum = FileTypeEnum.Geojson;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly table: string = 'eurostat_countries_2020';
  readonly rows: Map<string, [string, string]> = new Map([
    ['codeiso3', ['ISO3_CODE', 'varchar']]
  ]);
  sheetOptions = {};

  async import(): Promise<void> {
    // TODO
  }

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
                SELECT ${[...this.rows.values()].map((r) => `(properties->>'${r[0]}')::${r[1]}`).join(', \n')},
                st_multi(st_geomfromgeojson(geometry)) as geom 
                FROM tmp
              `,
              values: [results.value.features],
            };
            //console.debug(results.value);
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
