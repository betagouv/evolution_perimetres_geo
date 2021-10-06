import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class CeremaAom2021 extends AbstractDataset {
  static producer = 'cerema';
  static dataset = 'aom';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.cerema.fr/system/files/documents/2021/06/base_rt_2021_v4_diffusion.xlsx';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly table: string = 'cerema_aom_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['id_reseau', ['Id réseau', 'integer']],
    ['nom_reseau', ['Nom du réseau', 'varchar']],
    ['siren_aom', ['N° SIREN AOM', 'integer']],
    ['nom_aom', ['Nom de l’AOM', 'varchar']],
    ['forme_juridique_aom', ['Forme juridique de l’AOM', 'varchar']],
    ['region', ['Région siège', 'varchar']],
    ['departement', ['Département siège', 'varchar']],
    ['siren_group', ['N° SIREN du groupement', 'varchar']],
    ['lien_banatic', ['Lien Banatic', 'varchar']],
    ['nom_group', ['Nom du groupement', 'varchar']],
    ['forme_juridique_group', ['Nature juridique du groupement', 'varchar']],
    ['nb_membres', ['Nombre de membres', 'varchar']],
    ['pop_aom_2018', ['Population  totale 2018', 'integer']],
    ['siren_membre', ['Siren membre', 'integer']],
    ['com', ['N° INSEE', 'varchar']],
    ['nom_membre', ['Nom membre', 'varchar']],
    ['pop_com_2018', ['Population  municipale 2018', 'varchar']],
    ['pop_banatic_2018', ['Population  totale 2018 (Banatic)', 'integer']],
    ['surface', ['Surface (km²)', 'float']],
    ['nom_com', ['Intitulé commune wikipédia', 'varchar']],
    ['wikipedia', ['Lien Page wikipedia', 'varchar']],
  ]);

  fileType: FileTypeEnum = FileTypeEnum.Xls;
  sheetOptions = {
    name: 'RT_2021_-_Composition_communale',
    startRow: 0,
  };

  async import(): Promise<void> {
    // TODO
  }
}
