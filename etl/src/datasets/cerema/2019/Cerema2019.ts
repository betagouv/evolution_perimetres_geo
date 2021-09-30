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
    readonly rows: string[] = [
        'id_reseau', 
        'region',
        'departement', 
        'nom_reseau',
        'nom_aom',
        'forme_juridique_aom',
        'siren_aom',
        'siren_group',
        'nom_group',
        'forme_juridique_group',
        'nb_membres',
        'pop_aom',
        'siren_membre',
        'com',
        'nom_membre',
        'pop_com',
    ];

    sheetOptions = {
        name: 'RT 2019- Composition communale',
        startRow: 0,
    };

    async import(): Promise<void> {

    }
}
