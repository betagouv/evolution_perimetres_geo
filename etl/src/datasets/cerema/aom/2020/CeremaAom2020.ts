import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';

export class CeremaAom2020 extends AbstractDataset {
  static producer = 'cerema';
  static dataset = 'aom';
  static year = 2020;
  static table = 'cerema_aom_2020';

  readonly url: string = 'https://www.cerema.fr/system/files/documents/2020/07/base_rt_2020_v1-1_diffusion_0.ods';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([
    ['id_reseau', ['Id réseau', 'integer']],
    ['nom_reseau', ['Nom du réseau', 'varchar']],
    ['siren_aom', ['N° SIREN AOM', 'integer']],
    ['nom_aom', ['Nom de l’AOM', 'varchar']],
    ['forme_juridique_aom', ['Forme juridique de l’AOM', 'varchar']],
    ['region', ['Région siège', 'varchar']],
    ['departement', ['Département siège', 'varchar']],
    ['siren_group', ['N° SIREN groupement', 'integer']],
    ['lien_banatic', ['Lien Banatic', 'varchar']],
    ['nom_group', ['Nom du groupement', 'varchar']],
    ['forme_juridique_group', ['Nature juridique du groupement', 'varchar']],
    ['nb_membres', ['Nombre de membres', 'integer']],
    ['pop_aom_2017', ['Population  totale 2017 (Banatic)', 'integer']],
    ['siren_membre', ['Siren membre', 'integer']],
    ['com', ['N° INSEE', 'varchar']],
    ['nom_membre', ['Nom membre', 'varchar']],
    ['pop_com_2017', ['Population  municipale 2017', 'varchar']],
    ['pop_banatic_2017', ['Population  totale 2017 (Banatic)_1', 'integer']],
    ['surface', ['Surface (km²)', 'integer']],
    ['nom_com', ['intitulé commune wikipédia', 'varchar']],
    ['wikipedia', ['Lien Page wikipedia', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Ods;
  sheetOptions = {
    name: 'RT_2020_-_Composition_communale',
    startRow: 0,
  };

  readonly tableIndex = 'com';
  readonly importSql = `
    UPDATE ${this.targetTable} a SET
      a.aom = b.id_reseau,
      a.l_aom = b.nom_aom
    FROM ${this.tableWithSchema} b
    WHERE a.com = b.com AND a.year = 2020;
  `;
}
