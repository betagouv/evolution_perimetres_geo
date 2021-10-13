import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateComEvolutionTable extends AbstractDatastructure {
  static uuid = 'create_com_evolution_table';
  static table = 'com_evolution';
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
          year SMALLINT NOT NULL,
          old_com VARCHAR(5) NOT NULL,
          new_com VARCHAR(5) NOT NULL
      );
      CREATE INDEX ${this.tableWithSchema}_old_com_index ON ${this.tableWithSchema} USING btree (old_com);
      CREATE INDEX ${this.tableWithSchema}_new_com_index ON ${this.tableWithSchema} USING btree (new_com);
    `;
}
