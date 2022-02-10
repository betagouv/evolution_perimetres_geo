import { AbstractDatastructure } from '../common/AbstractDatastructure';

export class CreateComEvolutionTable extends AbstractDatastructure {
  static uuid = 'create_com_evolution_table';
  static table = 'com_evolution';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
          year SMALLINT NOT NULL,
          mod SMALLINT NOT NULL,
          old_com VARCHAR(5),
          new_com VARCHAR(5),
          l_mod VARCHAR,
          updated_at timestamp,
          UNIQUE(year,mod,old_com,new_com)
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_mod_index ON ${this.tableWithSchema} USING btree (mod);
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_old_com_index ON ${this.tableWithSchema} USING btree (old_com);
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_new_com_index ON ${this.tableWithSchema} USING btree (new_com);
    `;
}
