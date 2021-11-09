import { AbstractDataset } from '../../../../common/AbstractDataset';
import { CeremaAom2021 } from '../../../../datasets';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class DgclBanatic2021 extends AbstractDataset {
  static producer = 'dgcl';
  static dataset = 'banatic';
  static year = 2021;
  static table = 'dgcl_banatic_2021';

  readonly url: string = 'https://www.banatic.interieur.gouv.fr/V5/fichiers-en-telechargement/telecharger.php?zone=N&date=01/10/2021&format=C';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([
    ['siren', ['N° SIREN', 'varchar']],
    ['nom', ['Nom du groupement', 'varchar']],
    ['nature', ['Nature juridique', 'varchar']],
    ['date_creation', ['Date de création', 'date']],
    ['date_effet', ['Date d\'effet', 'date']],
    ['competence', ['C4530', 'boolean']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Xls;
  sheetOptions = {
    name: 'Sheet1',
    startRow: 0,
  };
  readonly importSql = `
    UPDATE ${this.targetTableWithSchema} AS a
      SET l_aom = t.nom, aom = t.siren
    FROM (
      SELECT distinct a.com, b.siren, b.nom
      FROM ${this.targetSchema}.${CeremaAom2021.table} AS a
      JOIN ${this.tableWithSchema} AS b
      ON a.siren_group = b.siren
      WHERE a.siren_aom is null AND b.competence is true
    ) t
    WHERE  a.com = t.com AND a.year = 2021;
  `;
}