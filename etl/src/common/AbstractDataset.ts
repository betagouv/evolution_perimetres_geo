import { loadSqlFile, downloadFile  } from "@/helpers";
import { decompressFile } from "@/helpers/decompressFile";
import { ArchiveFileTypeEnum, DatasetInterface, FileTypeEnum } from "@/interfaces";
import { Pool } from "pg";

export abstract class AbstractDataset implements DatasetInterface {
    abstract readonly beforeSqlPath: string;
    abstract readonly url: string;
    abstract readonly fileType: FileTypeEnum;
    abstract readonly fileArchiveType: ArchiveFileTypeEnum;
    abstract readonly afterSqlPath: string;
    
    abstract filepaths: string[];

    constructor(
        protected connection: Pool,
    ) {}

    abstract validate(datasets: Set<string>): Promise<void>;

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

    abstract transform(): Promise<void>;
    abstract load(): Promise<void>;
    abstract import(): Promise<void>;
    
    async after(): Promise<void> {
       const sql = await loadSqlFile(this.afterSqlPath);
       await this.connection.query(sql);
    }
}