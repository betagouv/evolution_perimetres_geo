import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class InseeMvtcom2021 extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'mvtcom';
  static year = 2021;
  static table = 'insee_mvtcom_2021';

  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/mvtcommune2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
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

  readonly extraBeforeSql = `ALTER TABLE ${this.table} ALTER COLUMN mod SET NOT NULL;`;

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  // TODO index
  async import(): Promise<void> {
    // TODO
  }
}
