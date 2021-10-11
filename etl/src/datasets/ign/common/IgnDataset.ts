import { AbstractDataset } from '../../../common/AbstractDataset';
import { SqlError, TransformError } from '../../../errors';
import { streamData, transformGeoFile } from '../../../helpers';
import { FileTypeEnum, ArchiveFileTypeEnum } from '../../../interfaces';

export interface TransformationParamsInterface {
  key: string;
  file: string;
  format: string;
  precision: number;
  force: boolean;
  simplify: string[];
}

const defaultConfig: TransformationParamsInterface = {
  key: '',
  file: '',
  format: 'geojson',
  precision: 0.000001,
  force: false,
  simplify: [],
};
export abstract class IgnDataset extends AbstractDataset {
  abstract readonly transformations: Map<string, Partial<TransformationParamsInterface>>;

  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.SevenZip;
  readonly rows: Map<string, [string, string]> = new Map([
    ['com', ['INSEE_COM', 'varchar']],
    ['pop', ['POPULATION', 'integer']],
  ]);

  sheetOptions = {
    filter: 'features',
  };

  fileType: FileTypeEnum = FileTypeEnum.Shp;

  async transform(): Promise<void> {
    try {
      const filepaths: string[] = [];
      for await (const [file, customConfig] of this.transformations) {
        const config = { ...defaultConfig, customConfig };
        const path = this.filepaths.find((f) => f.indexOf(file));
        if (path) {
          let transformedFilePath: string;
          if (config.simplify && config.simplify.length) {
            transformedFilePath = path;
            for (const simplify of config.simplify) {
              transformedFilePath = await transformGeoFile(
                transformedFilePath,
                config.format,
                config.precision,
                config.force,
                simplify,
              );
            }
          } else {
            transformedFilePath = await transformGeoFile(path, config.format, config.precision, config.force);
          }
          filepaths.push(transformedFilePath);
          this.transformations.set(file, { ...customConfig, file: transformedFilePath });
        }
      }
      this.filepaths = filepaths;
      this.fileType = FileTypeEnum.Geojson;
    } catch (e) {
      throw new TransformError(this, (e as Error).message);
    }
  }

  async load(): Promise<void> {
    const connection = await this.connection.connect();
    await connection.query('BEGIN TRANSACTION');
    try {
      for (const [, { file, key }] of this.transformations) {
        if (file && file.length) {
          const cursor = streamData(file, this.fileType, this.sheetOptions);
          let done = false;
          do {
            const results = await cursor.next();
            done = !!results.done;
            if (results.value) {
              const values = [JSON.stringify(results.value)];
              switch (key) {
                case 'geom':
                  await connection.query({
                    text: `
                      INSERT INTO ${this.table} (
                        ${[...this.rows.keys()].join(', \n')}, ${key}
                      )
                      WITH tmp as(
                        SELECT * FROM
                        json_to_recordset($1)
                        as t(type varchar, properties json,geometry json)
                      )
                      SELECT ${[...this.rows.values()].map((r) => `(properties->>'${r[0]}')::${r[1]}`).join(', \n')},
                      st_multi(st_geomfromgeojson(geometry)) as ${key} 
                      FROM tmp 
                    `,
                    values,
                  });
                  break;
                case 'geom_simple':
                  await connection.query({
                    text: `
                      WITH tmp as(
                        SELECT * FROM
                        json_to_recordset($1)
                        as t(type varchar, properties json,geometry json)
                      )
                      UPDATE ${this.table} AS a
                      SET a.${key} = st_geomfromgeojson(tmp.geometry)
                      FROM tmp
                      WHERE a.${this.rows[0][0]} = (tmp.properties->>'${this.rows[0][0]}')::${this.rows[0][1]}
                    `,
                    values,
                  });
                  break;
                case 'centroid':
                  await connection.query({
                    text: `
                      WITH tmp as(
                        SELECT * FROM
                        json_to_recordset($1)
                        as t(type varchar, properties json,geometry json)
                      )
                      UPDATE ${this.table} AS a
                      SET a.${key} = st_multi(st_geomfromgeojson(tmp.geometry))
                      FROM tmp
                      WHERE a.${this.rows[0][0]} = (tmp.properties->>'${this.rows[0][0]}')::${this.rows[0][1]}
                    `,
                    values,
                  });
                  break;
              }
            }
          } while (!done);
        }
      }
      await connection.query('COMMIT');
      connection.release();
    } catch (e) {
      await connection.query('ROLLBACK');
      connection.release();
      throw new SqlError(this, (e as Error).message);
    }
  }
}
