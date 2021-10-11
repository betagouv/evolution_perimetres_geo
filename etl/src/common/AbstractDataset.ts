import { loadSqlFile, downloadFile, streamData, decompressFile, getDatasetUuid } from '../helpers';
import { ArchiveFileTypeEnum, DatasetInterface, FileTypeEnum, StaticAbstractDataset, Migrable } from '../interfaces';
import { Pool } from 'pg';
import { StreamDataOptions } from '../interfaces/StreamDataOptions';
import { DownloadError, SqlError, ValidationError } from 'src/errors';

export abstract class AbstractDataset implements DatasetInterface {
  static get uuid(): string {
    const self = this as unknown as StaticAbstractDataset;
    return getDatasetUuid(self.producer, self.dataset, self.year);
  }

  abstract readonly beforeSqlPath: string;
  abstract readonly url: string;
  abstract readonly fileArchiveType: ArchiveFileTypeEnum;
  abstract readonly afterSqlPath: string;
  abstract readonly table: string;
  abstract readonly rows: Map<string, [string, string]>;
  abstract readonly fileType: FileTypeEnum;

  required: Set<Migrable> = new Set();
  sheetOptions: StreamDataOptions;
  filepaths: string[] = [];
  readonly importSql: string = '';
  readonly targetTable: string = 'perimeters';

  constructor(protected connection: Pool) {}

  async validate(done: Set<Migrable>): Promise<void> {
    const difference = new Set([...this.required].filter((x) => !done.has(x)));
    if (difference.size > 0) {
      throw new ValidationError(
        this,
        `Cant apply this dataset, element is missing (${[...difference].map((d) => d.uuid).join(', ')})`,
      );
    }
  }

  async before(): Promise<void> {
    try {
      const sql = await loadSqlFile(this.beforeSqlPath);
      await this.connection.query(sql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }

  async download(): Promise<void> {
    try {
      const filepaths: string[] = [];
      const filepath = await downloadFile(this.url);
      if (this.fileArchiveType !== ArchiveFileTypeEnum.None) {
        filepaths.push(...(await decompressFile(filepath, this.fileArchiveType, this.fileType)));
      } else {
        filepaths.push(filepath);
      }
      this.filepaths = filepaths;
    } catch (e) {
      throw new DownloadError(this, (e as Error).message);
    }
  }

  async transform(): Promise<void> {}

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
                            ${[...this.rows.keys()].join(', \n')}
                        )
                        SELECT *
                        FROM json_to_recordset ($1)
                          AS tmp (
                          ${[...this.rows.values()].map((r) => `"${r[0]}" ${r[1]}`).join(', \n')}
                          )
                      `,
              values: [JSON.stringify(results.value).replace(/'/g, "''")],
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
      throw new SqlError(this, (e as Error).message);
    }
  }

  async import(): Promise<void> {
    try {
      await this.connection.query(this.importSql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }

  async after(): Promise<void> {
    try {
      const sql = await loadSqlFile(this.afterSqlPath);
      await this.connection.query(sql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }
}
