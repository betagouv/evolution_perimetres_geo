import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateComEvolutionTable extends AbstractDatastructure {
  static uuid = 'create_com_evolution_table';
  static table = 'com_evolution';
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
          year SMALLINT NOT NULL,
          old_com VARCHAR(5) NOT NULL,
          new_com VARCHAR(5) NOT NULL
      );
      CREATE INDEX ${this.table}_old_com_index ON ${this.table} USING btree (old_com);
      CREATE INDEX ${this.table}_new_com_index ON ${this.table} USING btree (new_com);
    `;
}
