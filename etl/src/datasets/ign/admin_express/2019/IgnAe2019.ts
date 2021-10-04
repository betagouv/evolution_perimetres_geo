import { AbstractDataset } from '../../../../common/AbstractDataset';
import { streamData } from '../../../../helpers';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class IgnAe2019 extends AbstractDataset {
  static dataset = 'ign_ae';
  static year = 2019;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-0__SHP__FRA_L93_2019-09-24.7z';
  readonly fileType: FileTypeEnum = FileTypeEnum.Geojson;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.SevenZip;
  readonly table: string = 'ign_ae_2019';
  readonly rows: Map<string, [string, string]> = new Map([
    ['com', ['INSEE_COM', 'varchar']],
    ['pop', ['POPULATION', 'integer']]
  ]);
  sheetOptions = {};

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
                        WITH temp as(
                          SELECT * FROM
                          json_to_recordset($1)
                          as tmp(type varchar, properties json,geometry json)
                        )
                        SELECT ${[...this.rows.values()].map((r) => `(properties->>'${r[0]}')::${r[1]}`).join(', \n')},
                        st_multi(st_geomfromgeojson(a.geometry)) as geom 
                        FROM tmp
                      `,
              values: [JSON.stringify(results.value)],
            };
            console.debug(query);
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

  async import(): Promise<void> {
    // TODO
  }
}
