import { AbstractDataset } from '../../../../common/AbstractDataset';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class InseePerim2021 extends AbstractDataset {
  static dataset = 'insee_perim';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2021.zip';
  readonly fileType: FileTypeEnum = FileTypeEnum.Xls;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly table: string = 'insee_perim_2021';
  readonly rows: Map<string, [string, string]> = new Map([
    ['codgeo', ['CODGEO', 'varchar']],
    ['libgeo', ['LIBGEO', 'varchar']],
    ['epci', ['EPCI', 'varchar']],
    ['libepci', ['LIBEPCI', 'varchar']],
    ['dep', ['DEP', 'varchar']],
    ['reg', ['REG', 'varchar']]
  ]);
  sheetOptions = {
    name: 'Composition_communale',
    startRow: 6,
  };

  async import(): Promise<void> {
    // TODO
  }
}
