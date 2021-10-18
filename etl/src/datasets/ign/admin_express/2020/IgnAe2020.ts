import { IgnDataset, TransformationParamsInterface } from '../../common/IgnDataset';
import path from 'path';
import { StaticAbstractDataset } from '../../../../interfaces';

export class IgnAe2020 extends IgnDataset {
  static producer = 'ign';
  static dataset = 'ae';
  static year = 2020;
  static table = 'ign_ae_2020';

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string =
    // eslint-disable-next-line max-len
    'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-1__SHP__FRA_WGS84G_2020-11-20.7z';

  readonly transformations: Array<[string, Partial<TransformationParamsInterface>]> = [
    ['SHP_WGS84G_FRA/COMMUNE', { key: 'geom' }],
    ['SHP_WGS84G_FRA/ARRONDISSEMENT_MUNICIPAL', { key: 'geom' }],
    [
      'SHP_WGS84G_FRA/COMMUNE',
      {
        key: 'geom_simple',
        simplify: ['-simplify 60% keep-shapes', '-simplify 50% keep-shapes', '-simplify 40% keep-shapes'],
      },
    ],
    [
      'SHP_WGS84G_FRA/ARRONDISSEMENT_MUNICIPAL',
      {
        key: 'geom_simple',
        simplify: ['-simplify 60% keep-shapes', '-simplify 50% keep-shapes', '-simplify 40% keep-shapes'],
      },
    ],
    ['SHP_WGS84G_FRA/CHEF_LIEU_CARTO', { key: 'centroid' }],
    ['SHP_WGS84G_FRA/CHFLIEU_ARRONDISSEMENT_MUNICIPAL', { key: 'centroid' }],
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
      centroid as centroid,
      geom as geom,
      geom_simple as geom_simple,
      st_area(geom::geography)/1000000 as surface,
      com,
      pop,
      'XXXXX' as country,
      'France' as l_country
    FROM ${this.tableWithSchema};
  `;
}
