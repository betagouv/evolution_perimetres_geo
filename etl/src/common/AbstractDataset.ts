import { loadSqlFile, downloadFile, streamData, decompressFile } from "../helpers";
import { ArchiveFileTypeEnum, DatasetInterface, FileTypeEnum } from "../interfaces";
import { Pool } from "pg";

export abstract class AbstractDataset implements DatasetInterface {
    abstract readonly beforeSqlPath: string;
    abstract readonly url: string;
    abstract readonly fileType: FileTypeEnum;
    abstract readonly fileArchiveType: ArchiveFileTypeEnum;
    abstract readonly afterSqlPath: string;
    abstract readonly table: string;
    abstract readonly rows: string[];

    sheetOptions: { name?: string; startRow?: number } | undefined;
    filepaths: string[] = [];

    constructor(
        protected connection: Pool,
    ) {}

    async validate(datasets: Set<string>): Promise<void> {}

    async before(): Promise<void> {
       const sql = await loadSqlFile(this.beforeSqlPath);
       await this.connection.query(sql);
    }

    async download(): Promise<void> {
        const filepaths: string[] = [];
        let filepath = await downloadFile(this.url);
        if(this.fileArchiveType !== ArchiveFileTypeEnum.None) {
            filepaths.push(...await decompressFile(filepath, this.fileArchiveType));
        } else {
            filepaths.push(filepath);
        }
        this.filepaths = filepaths;
    }

    async transform(): Promise<void> {}

    async load(): Promise<void> {
        console.log(this.filepaths);
        const connection = await this.connection.connect();
        await connection.query('BEGIN TRANSACTION');
        try {
        for(const filepath of this.filepaths) {
          const cursor = streamData(filepath, this.fileType, this.sheetOptions);
          let done = false;
          do {
            const results = await cursor.next();
            done = !!results.done;
            console.log({results})
            if (results.value) {
                console.log(JSON.stringify(results.value));
                  await connection.query({
                      text: `
                        INSERT INTO ${this.table} (${this.rows.join(',')})
                        SELECT * FROM json_populate_recordset(null::${this.table}, $1)                      
                      `,
                      values: [JSON.stringify(results.value)],
                  });
            }
          } while (!done)
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