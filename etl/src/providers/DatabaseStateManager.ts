import { Pool } from 'pg';
import { StateManagerInterface, AppConfigInterface, StaticMigrable, State } from '../interfaces';
import { MemoryStateManager } from './MemoryStateManager';

export class DatabaseStateManager {
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

  async toMemory(): Promise<StateManagerInterface> {
    const result = await this.connection.query(`
      SELECT key FROM ${this.tableWithSchema} ORDER BY datetime ASC
    `);

    const setResult: Set<StaticMigrable> = new Set();
    for (const { key } of result.rows) {
      const migrable = this.migrations.get(key);
      if (!migrable) {
        console.error(`Migration ${key} is not found`);
      } else {
        setResult.add(migrable);
      }
    }

    return new MemoryStateManager(setResult);
  }

  async fromMemory(state: StateManagerInterface): Promise<void> {
    const data = state.get(State.Done);
    const query = {
      text: `
        INSERT INTO ${this.tableWithSchema} (key)
        SELECT * FROM UNNEST ($1::varchar[])
        ON CONFLICT DO NOTHING
      `,
      values: [[...data].map((d) => d.uuid)],
    };
    await this.connection.query(query);
  }
}
