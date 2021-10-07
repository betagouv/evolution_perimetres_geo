import { IgnDataset, TransformationParamsInterface } from '../../common/IgnDataset';
import path from 'path';

export class IgnAe2021 extends IgnDataset {
  static producer = 'ign';
  static dataset = 'ae';
  static year = 2021;

  readonly beforeSqlPath: string = path.join(__dirname, 'before.sql');
  readonly afterSqlPath: string = path.join(__dirname, 'after.sql');
  readonly url: string =
    // eslint-disable-next-line max-len
    'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_3-0__SHP__FRA_L93_2021-05-19.7z';
  readonly table: string = 'ign_ae_2021';

  readonly transformations: Map<string, Partial<TransformationParamsInterface>> = new Map([
    ['SHP_LAMB93_FR/COMMUNE', { key: 'geom' }],
    ['SHP_LAMB93_FR/ARRONDISSEMENT_MUNICIPAL', { key: 'geom' }],
    [
      'SHP_LAMB93_FR/COMMUNE',
      {
        key: 'geom_simple',
        simplify: ['-simplify 60% keep-shapes', '-simplify 50% keep-shapes', '-simplify 40% keep-shapes'],
      },
    ],
    [
      'SHP_LAMB93_FR/ARRONDISSEMENT_MUNICIPAL',
      {
        key: 'geom_simple',
        simplify: ['-simplify 60% keep-shapes', '-simplify 50% keep-shapes', '-simplify 40% keep-shapes'],
      },
    ],
    ['SHP_LAMB93_FR/CHFLIEU_COMMUNE', { key: 'centroid' }],
    ['SHP_LAMB93_FR/CHFLIEU_ARRONDISSEMENT_MUNICIPAL', { key: 'centroid' }],
  ]);

  readonly importSql = `
    INSERT INTO perimeters(year,centroid,geom,geom_simple,arr,pop,country,l_country)
    SELECT 2021 as year,centroid,geom,geom_simple,com,pop,'XXXXX' as country,'France' as l_country
    FROM ${this.table};
  `;
}
