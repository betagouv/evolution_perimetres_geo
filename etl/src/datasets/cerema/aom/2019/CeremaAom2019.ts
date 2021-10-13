import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class CeremaAom2019 extends AbstractDataset {
  static producer = 'cerema';
  static dataset = 'aom';
  static year = 2019;
  static table = 'cerema_aom_2019';

  readonly url: string =
    'http://www.cerema.fr/system/files/documents/2019/07/base_rt_2019_-_v1-1_-_version_diffusable_0.ods';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([
    ['id_reseau', ['Id réseau', 'varchar']],
    ['region', ['Région siège', 'varchar']],
    ['departement', ['Département siège', 'varchar']],
    ['nom_reseau', ['Nom du réseau', 'varchar']],
    ['nom_aom', ['Nom de l’AOM', 'varchar']],
    ['forme_juridique_aom', ['Forme juridique de l’AOM', 'varchar']],
    ['siren_aom', ['N° SIREN de l’AOM', 'varchar']],
    ['siren_group', ['N° SIREN de l’EPCI', 'varchar']],
    ['nom_group', ['Nom de l’EPCI', 'varchar']],
    ['forme_juridique_group', ['Nature juridique de l’EPCI', 'varchar']],
    ['nb_membres', ['Nombre de membres', 'integer']],
    ['pop_aom', ['Population', 'integer']],
    ['siren_membre', ['Siren membre', 'varchar']],
    ['com', ['Code INSEE', 'varchar']],
    ['nom_membre', ['Nom membre', 'varchar']],
    ['pop_com', ['Population municipale', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Ods;
  sheetOptions = {
    name: 'RT 2019- Composition communale',
    startRow: 0,
  };

  readonly tableIndex = 'com';
  readonly importSql = `
    UPDATE ${this.targetTable} SET
      aom = (CASE WHEN t.id_reseau = '/' THEN NULL ELSE t.id_reseau END),
      l_aom = b.nom_aom
    FROM ${this.tableWithSchema} t
    WHERE com = t.com AND year = 2019;
  `;
}
