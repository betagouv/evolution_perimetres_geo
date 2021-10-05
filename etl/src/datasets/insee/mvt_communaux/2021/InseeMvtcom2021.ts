import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseeMvtcom2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'mvtcom';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/mvtcommune2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly table: string = 'insee_mvtcom_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['mod', ['0', 'smallint']],
    ['date_eff', ['1', 'varchar']],
    ['typecom_av', ['2', 'varchar']],
    ['com_av', ['3', 'varchar']],
    ['tncc_av', ['4', 'varchar']],
    ['ncc_av', ['5', 'varchar']],
    ['nccenr_av', ['6', 'varchar']],
    ['libelle_av', ['7', 'varchar']],
    ['typecom_ap', ['8', 'varchar']],
    ['com_ap', ['9', 'varchar']],
    ['tncc_ap', ['10', 'varchar']],
    ['ncc_ap', ['11', 'varchar']],
    ['nccenr_ap', ['12', 'varchar']],
    ['libelle_ap', ['13', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  async import(): Promise<void> {
    // TODO
  }
}
