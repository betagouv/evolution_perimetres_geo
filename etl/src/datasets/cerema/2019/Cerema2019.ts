import { AbstractDataset } from "../../../common/AbstractDataset";
import { ArchiveFileTypeEnum, FileTypeEnum } from "../../../interfaces";
import path from 'path';

export class Cerema2019 extends AbstractDataset  {
    static dataset = 'cerema_aom';
    static year = 2019;
    
    readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
    readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
    readonly url: string = 'http://www.cerema.fr/system/files/documents/2019/07/base_rt_2019_-_v1-1_-_version_diffusable_0.ods';
    readonly fileType: FileTypeEnum = FileTypeEnum.Ods;
    readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
    readonly table: string = 'cerema_aom_2019';
    readonly rows: Map<string, [string, string]> = new Map([
        ['id_reseau', ['Id réseau', 'varchar']], 
        ['region', ['Région siège', 'varchar']],
        ['departement', ['Département siège', 'varchar']], 
        ['nom_reseau', ['Nom du réseau', 'varchar']],
        ['nom_aom', ['Nom de l\’AOM', 'varchar']],
        ['forme_juridique_aom', ['Forme juridique de l\’AOM', 'varchar']],
        ['siren_aom', ['N° SIREN de l\’AOM', 'varchar']],
        ['siren_group', ['N° SIREN de l\’EPCI', 'varchar']],
        ['nom_group', ['Nom de l’EPCI', 'varchar']],
        ['forme_juridique_group', ['Nature juridique de l\’EPCI', 'varchar']],
        ['nb_membres', ['Nombre de membres', 'integer']],
        ['pop_aom', ['Population', 'integer']],
        ['siren_membre', ['Siren membre', 'varchar']],
        ['com', ['Code INSEE', 'varchar']],
        ['nom_membre', ['Nom membre', 'varchar']],
        ['pop_com', ['Population municipale', 'varchar']],
    ]);

    sheetOptions = {
        name: 'RT 2019- Composition communale',
        startRow: 0,
    };

    async import(): Promise<void> {
        // TODO
    }
}
