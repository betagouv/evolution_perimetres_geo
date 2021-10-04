import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateGeoTable extends AbstractDatastructure {
  static uuid = 'create_geo_table';
  readonly table = 'geo';
  readonly beforeSql = `
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE TABLE IF NOT EXISTS ${this.table} (
          id SERIAL PRIMARY KEY,
          year SMALLINT NOT NULL,
          center GEOGRAPHY(POINT, 4326) NOT NULL,
          outline GEOGRAPHY NOT NULL,
          outline_simple GEOGRAPHY NOT NULL,
          arr_name VARCHAR(256),
          arr_code VARCHAR(2),
          city_name VARCHAR(256),
          city_code VARCHAR(5),
          group_name VARCHAR(256),
          group_code VARCHAR(XXX),
          dep_name VARCHAR(256),
          dep_code VARCHAR(3),
          reg_name VARCHAR(256),
          reg_code VARCHAR(2),
          country_name VARCHAR(256),
          country_code VARCHAR(XXX),
          mob_name VARCHAR(256),
          mob_code VARCHAR(XXX),
          population INT,
          surface INT
      );
    `;

  readonly afterSql = `
      DROP TABLE IF EXISTS ${this.table}
    `;
}
