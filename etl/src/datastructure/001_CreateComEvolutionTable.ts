import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateComEvolutionTable extends AbstractDatastructure {
  static uuid = 'create_com_evolution_table';
  static table = 'com_evolution';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
          year SMALLINT NOT NULL,
          old_com VARCHAR(5),
          new_com VARCHAR(5),
          mod SMALLINT,
          l_mod VARCHAR
      );
      CREATE INDEX ${this.indexWithSchema}_old_com_index ON ${this.tableWithSchema} USING btree (old_com);
      CREATE INDEX ${this.indexWithSchema}_new_com_index ON ${this.tableWithSchema} USING btree (new_com);
    `;
}
