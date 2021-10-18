import { Pool } from 'pg';

export class MigratorState {
  readonly table: string = 'dataset_migration';

  constructor(protected connection: Pool, protected targetSchema: string = 'public') {}

  get tableWithSchema(): string {
    return `${this.targetSchema}.${this.table}`;
  }

  async install(): Promise<void> {
    await this.connection.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
          key varchar(128) PRIMARY KEY,
          datetime timestamp NOT NULL DEFAULT NOW()
      )
    `);
  }

  async get(): Promise<Set<string>> {
    const result = await this.connection.query(`
      SELECT key FROM ${this.tableWithSchema} ORDER BY datetime ASC
    `);
    return new Set(result.rows.map((r) => r.key));
  }

  async set(key: string): Promise<void> {
    const query = {
      text: `
        INSERT INTO ${this.tableWithSchema} (key)
          VALUES ($1)
        ON CONFLICT DO NOTHING
      `,
      values: [key],
    };
    await this.connection.query(query);
  }
}
