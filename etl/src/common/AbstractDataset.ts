import { loadSqlFile, downloadFile, streamData, decompressFile } from '../helpers';
import { ArchiveFileTypeEnum, DatasetInterface, FileTypeEnum } from '../interfaces';
import { Pool } from 'pg';

export abstract class AbstractDataset implements DatasetInterface {
  abstract readonly beforeSqlPath: string;
  abstract readonly url: string;
  abstract readonly fileType: FileTypeEnum;
  abstract readonly fileArchiveType: ArchiveFileTypeEnum;
  abstract readonly afterSqlPath: string;
  abstract readonly table: string;
  abstract readonly rows: Map<string, [string, string]>;

  sheetOptions: { name?: string; startRow?: number } | undefined;
  filepaths: string[] = [];

  constructor(protected connection: Pool) {}

  async validate(datasets: Set<string>): Promise<void> {}

  async before(): Promise<void> {
    const sql = await loadSqlFile(this.beforeSqlPath);
    await this.connection.query(sql);
  }

  async download(): Promise<void> {
    const filepaths: string[] = [];
    const filepath = await downloadFile(this.url);
    if (this.fileArchiveType !== ArchiveFileTypeEnum.None) {
      filepaths.push(...(await decompressFile(filepath, this.fileArchiveType)));
    } else {
      filepaths.push(filepath);
    }
    this.filepaths = filepaths;
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
      throw e;
    }
  }
  
  abstract import(): Promise<void>;

  async after(): Promise<void> {
    const sql = await loadSqlFile(this.afterSqlPath);
    await this.connection.query(sql);
  }
}
