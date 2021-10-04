import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateCityUpdateTable extends AbstractDatastructure {
  static uuid = 'create_city_update_table';
  readonly table = 'city_update';
  readonly beforeSql = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
          year SMALLINT NOT NULL,
          old_city_code VARCHAR(5),
          new_city_code VARCHAR(5)
      );
    `;

  readonly afterSql = `
      DROP TABLE IF EXISTS ${this.table};
    `;
}
