import { AbstractDataset } from 'src/common/AbstractDataset';
import { streamData, transformGeoFile } from '../../../helpers';
import { FileTypeEnum } from '../../../interfaces';

export abstract class IgnDataset extends AbstractDataset {
  //transformations : filename, [output filename,output file format,digit number dor geometry,boolean to force overwriting file, simplification (optionnal)]
  abstract readonly transformations: Map<string, [string, string, number, boolean, string?]>;
  abstract readonly transformedFileType: FileTypeEnum;
  transformedFilepaths: string[] = [];
  //loading : filename, [boolean for insert or update table, geometry column name]
  abstract readonly loading: Map<string, [boolean, string]>;

  async transform(): Promise<void> {
    for await (const file of this.transformations) {
      let path: string | undefined;
      if (file[0][3]) {
        path = this.transformedFilepaths.find((f) => f.indexOf(file[0]));
      } else {
        path = this.filepaths.find((f) => f.indexOf(file[0]));
      }
      if (path) {
        const geoFile = await transformGeoFile(path, file[1][0], file[1][1], file[1][2], file[1][3], file[1][4]);
        if (!file[0][3]) {
          this.transformedFilepaths.push(geoFile);
        }
      }
    }
  }

  async load(): Promise<void> {
    const connection = await this.connection.connect();
    await connection.query('BEGIN TRANSACTION');
    try {
      for (const file of this.loading) {
        const path = this.transformedFilepaths.find((f) => f.indexOf(file[0]));
        const query: { text: string; values: string[] } = { text: '', values: [] };
        if (path) {
          const cursor = streamData(path, this.transformedFileType, this.sheetOptions);
          let done = false;
          do {
            const results = await cursor.next();
            done = !!results.done;
            if (results.value) {
              // CASE INSERT
              if (file[1][0]) {
                query.text = `
                  INSERT INTO ${this.table} (
                      ${[...this.rows.keys()].join(', \n')},${file[1][1]}
                  )
                  WITH tmp as(
                    SELECT * FROM
                    json_to_recordset($1)
                    as t(type varchar, properties json,geometry json)
                  )
                  SELECT ${[...this.rows.values()].map((r) => `(properties->>'${r[0]}')::${r[1]}`).join(', \n')},
                  st_multi(st_geomfromgeojson(geometry)) as ${file[1][1]} 
                  FROM tmp
                `;
              } else {
                // CASE UPDATE
                if (file[1][1] === 'centroid') {
                  query.text = `
                    WITH tmp as(
                      SELECT * FROM
                      json_to_recordset($1)
                      as t(type varchar, properties json,geometry json)
                    )
                    UPDATE ${this.table} AS a
                    SET a.${file[1][1]} = st_geomfromgeojson(tmp.geometry)
                    FROM tmp
                    WHERE a.${this.rows[0][0]} = (tmp.properties->>'${this.rows[0][0]}')::${this.rows[0][1]}
                  `;
                } else {
                  query.text = `
                    WITH tmp as(
                      SELECT * FROM
                      json_to_recordset($1)
                      as t(type varchar, properties json,geometry json)
                    )
                    UPDATE ${this.table} AS a
                    SET a.${file[1][1]} = st_multi(st_geomfromgeojson(tmp.geometry))
                    FROM tmp
                    WHERE a.${this.rows[0][0]} = (tmp.properties->>'${this.rows[0][0]}')::${this.rows[0][1]}
                  `;
                }
              }
              query.values = [JSON.stringify(results.value)];
              console.debug(query);
              await connection.query(query);
            }
          } while (!done);
        }
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
