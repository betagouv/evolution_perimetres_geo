import { DatasetInterface, Migrable } from '../interfaces';
import { Pool } from 'pg';
import { SqlError } from '../errors';

export abstract class AbstractDatastructure implements DatasetInterface {
  abstract readonly sql: string;
  abstract readonly table: string;

  required: Set<Migrable> = new Set();

  constructor(protected connection: Pool) {}

  async validate(done: Set<Migrable>): Promise<void> {
    const difference = new Set([...this.required].filter((x) => !done.has(x)));
    if (difference.size > 0) {
      throw new Error(`Cant apply this dataset, element is missing (${[...difference].map((d) => d.uuid).join(', ')})`);
    }
  }

  async before(): Promise<void> {
    try {
      await this.connection.query(this.sql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }

  async download(): Promise<void> {}

  async transform(): Promise<void> {}

  async load(): Promise<void> {}

  async import(): Promise<void> {}

  async after(): Promise<void> {}
}
