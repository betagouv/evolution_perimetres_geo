import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateGeoTable extends AbstractDatastructure {
  static uuid = 'create_geo_table';
  readonly table = 'perimeters';
  readonly beforeSql = `
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE TABLE IF NOT EXISTS ${this.table} (
          id SERIAL PRIMARY KEY,
          year SMALLINT NOT NULL,
          centroid GEOMETRY(POINT, 2154) NOT NULL,
          geom GEOMETRY(MULTIPOLYGON, 2154) NOT NULL,
          geom_simple GEOMETRY(MULTIPOLYGON, 2154) NOT NULL,
          l_arr VARCHAR(256),
          arr VARCHAR(5),
          l_com VARCHAR(256),
          com VARCHAR(5),
          l_epci VARCHAR(256),
          epci VARCHAR(9),
          l_dep VARCHAR(256),
          dep VARCHAR(3),
          l_reg VARCHAR(256),
          reg VARCHAR(2),
          l_country VARCHAR(256),
          country VARCHAR(5),
          l_aom VARCHAR(256),
          aom VARCHAR(9),
          population INT,
          surface FLOAT(4)
      );
      CREATE INDEX ${this.table}_id_index ON ${this.table} USING btree (id);
      CREATE INDEX ${this.table}_centroid_index ON ${this.table} USING gist (centroid);
      CREATE INDEX ${this.table}_geom_index ON ${this.table} USING gist (geom);
      CREATE INDEX ${this.table}_simplified_geom_index ON ${this.table} USING gist (simplified_geom);
    `;

  readonly afterSql = `
      DROP TABLE IF EXISTS ${this.table}
    `;
}
