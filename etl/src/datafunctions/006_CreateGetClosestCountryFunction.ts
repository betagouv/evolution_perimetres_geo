import { AbstractDatafunction } from '../common/AbstractDatafunction';

export class CreateGetClosestCountryFunction extends AbstractDatafunction {
  static uuid = 'create_get_closest_country_function';
  static table = 'get_closest_country';
  static year = 2022;
  readonly sql = `
    CREATE OR REPLACE FUNCTION ${this.functionWithSchema}(lon float, lat float) returns table (
      year smallint,
      l_arr varchar,
      arr varchar,
      l_com varchar,
      com varchar,
      l_epci varchar,
      epci varchar,
      l_dep varchar,
      dep varchar,
      l_reg varchar,
      reg varchar,
      l_country varchar,
      country varchar,
      l_aom varchar,
      aom varchar,
      l_reseau varchar,
      reseau int,
      pop int,
      surface real 
    ) as $$
      SELECT
        year,
        l_arr,
        arr,
        l_com,
        com,
        l_epci,
        epci,
        l_dep,
        dep,
        l_reg,
        reg,
        l_country,
        country,
        l_aom,
        aom,
        l_reseau,
        reseau,
        pop,
        surface
      FROM ${this.targetTableWithSchema}
      WHERE
        geom IS NOT NULL
        AND country <> 'XXXXX'
        AND
        ST_Intersects(ST_Buffer(ST_Transform(ST_SetSRID(ST_Point($1, $2),'4326'),2154),1000),ST_Transform(geom,2154))
      ORDER BY year DESC
      LIMIT 1
    $$ language sql stable;
  `;
}
