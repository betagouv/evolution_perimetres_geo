import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseeReg2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'reg';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/region2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly table: string = 'insee_reg_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['reg', ['0', 'varchar']],
    ['chef_lieu', ['1', 'varchar']],
    ['tncc', ['2', 'varchar']],
    ['ncc', ['3', 'varchar']],
    ['nccenr', ['4', 'varchar']],
    ['libelle', ['5', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  readonly importSql = `
    UPDATE perimeters a
    SET a.l_reg = b.libelle
    FROM ${this.table} b
    WHERE a.reg = b.reg;
  `;
}
