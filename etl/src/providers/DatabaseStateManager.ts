import { Pool } from 'pg';
import { StateManagerInterface, AppConfigInterface, StaticMigrable } from '../interfaces';

export class DatabaseStateManager implements StateManagerInterface {
  readonly table: string = 'dataset_migration';
  readonly migrations: Map<string, StaticMigrable>;
  readonly targetSchema: string;

  constructor(protected connection: Pool, config: AppConfigInterface) {
    this.targetSchema = config.targetSchema;
    this.migrations = new Map([...config.migrations].map((m) => [m.uuid, m]));
  }

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

  async get(): Promise<Set<StaticMigrable>> {
    const result = await this.connection.query(`
      SELECT key FROM ${this.tableWithSchema} ORDER BY datetime ASC
    `);

    const setResult: Set<StaticMigrable> = new Set();
    for (const { key } of result.rows) {
      const migrable = this.migrations.get(key);
      if (!migrable) {
        throw new Error(`Migration ${key} is not found`);
      }
      setResult.add(migrable);
    }

    return setResult;
  }

  async set(key: StaticMigrable): Promise<void> {
    const query = {
      text: `
        INSERT INTO ${this.tableWithSchema} (key)
          VALUES ($1)
        ON CONFLICT DO NOTHING
      `,
      values: [key.uuid],
    };
    await this.connection.query(query);
  }
}
