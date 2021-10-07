import { IgnDataset } from '../../common/IgnDataset';
import { streamData } from '../../../../helpers';
import { ArchiveFileTypeEnum, FileTypeEnum } from '../../../../interfaces';
import path from 'path';

export class IgnAe2019 extends IgnDataset {
  static producer = 'ign';
  static dataset = 'ae';
  static year = 2019;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string =
    // eslint-disable-next-line max-len
    'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-0__SHP__FRA_L93_2019-09-24.7z';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.SevenZip;
  readonly table: string = 'ign_ae_2019';
  readonly rows: Map<string, [string, string]> = new Map([
    ['com', ['INSEE_COM', 'varchar']],
    ['pop', ['POPULATION', 'integer']],
  ]);
  readonly transformations: Map<string, [string,string, number,boolean,string?]> = new Map([
    ['SHP_LAMB93_FR/COMMUNE.shp', ['commune','geojson',0.000001,false]],
    ['SHP_LAMB93_FR/COMMUNE_CARTO.shp', ['commune_simple','geojson',0.000001,false,'-simplify dp interval=100 keep-shapes']],
    ['SHP_LAMB93_FR/CHEF_LIEU_CARTO.shp', ['chef_lieu','geojson',0.000001,false]],
  ]);

  readonly loading: Map<string,[boolean,string]> = new Map([
    ['commune.geojson', [true,'geom']],
    ['commune_simple.geojson', [false,'geom_simple']],
    ['chef_lieu.geojson', [false,'centroid']],
  ]);

  readonly fileType: FileTypeEnum = FileTypeEnum.Shp;
  readonly transformedFileType: FileTypeEnum = FileTypeEnum.Geojson;
  sheetOptions = {};
  
  readonly importSql =`
    INSERT INTO perimeters(year,centroid,geom,geom_simple,arr,pop,country,l_country)
    SELECT 2019 as year,centroid,geom,geom_simple,com,pop,'XXXXX' as country,'France' as l_country
    FROM ${this.table};
  `;
}
