import { AbstractDataset } from "@/common/AbstractDataset";
import path from 'path';

export class Insee2020 extends AbstractDataset  {
    static dataset = 'insee';
    static year = 2020;
    
    readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
    readonly url: string;
    readonly fileType: FileTypeEnum;
    readonly fileArchiveType: ArchiveFileTypeEnum;
    readonly afterSqlPath: string;
}