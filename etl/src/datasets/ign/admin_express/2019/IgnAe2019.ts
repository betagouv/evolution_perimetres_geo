import { IgnDataset, TransformationParamsInterface } from '../../common/IgnDataset';
import path from 'path';
import { StaticAbstractDataset } from '../../../../interfaces';

export class IgnAe2019 extends IgnDataset {
  static producer = 'ign';
  static dataset = 'ae';
  static year = 2019;
  static table = 'ign_ae_2019';

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string =
    // eslint-disable-next-line max-len
    'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-0__SHP__FRA_WGS84G_2019-09-24.7z';

  readonly transformations: Array<[string, Partial<TransformationParamsInterface>]> = [
    ['SHP_WGS84_FR/COMMUNE.shp', { key: 'geom' }],
    ['SHP_WGS84_FR/COMMUNE_CARTO.shp', { key: 'geom_simple', simplify: ['-simplify dp interval=100 keep-shapes'] }],
    ['SHP_WGS84_FR/CHEF_LIEU_CARTO.shp', { key: 'centroid' }],
  ];

  readonly importSql = `
    INSERT INTO ${this.targetTable} (
      year,
      centroid,
      geom,
      geom_simple,
      surface,
      arr,
      pop,
      country,
      l_country
    ) SELECT
      ${(this.constructor as StaticAbstractDataset).year} as year,
      centroid,
      geom,
      geom_simple,
      st_area(geom) as surface,
      com,
      pop,
      'XXXXX' as country,
      'France' as l_country
    FROM ${this.tableWithSchema};
  `;
}
