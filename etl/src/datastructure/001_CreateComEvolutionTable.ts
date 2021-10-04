import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateComEvolutionTable extends AbstractDatastructure {
  static uuid = 'create_com_evolution_table';
  readonly table = 'com_evolution';
  readonly beforeSql = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
          year SMALLINT NOT NULL,
          old_com VARCHAR(5) NOT NULL,
          new_com VARCHAR(5) NOT NULL
      );
      CREATE INDEX ${this.table}_id_index ON ${this.table} USING btree (id);
    `;

  readonly afterSql = `
      DROP TABLE IF EXISTS ${this.table};
    `;
}
