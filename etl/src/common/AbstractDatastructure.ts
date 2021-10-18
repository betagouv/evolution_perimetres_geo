import { DatasetInterface, StaticMigrable, StaticAbstractDataset } from '../interfaces';
import { Pool } from 'pg';
import { SqlError, ValidationError } from '../errors';
import { FileProvider } from 'src/providers/FileProvider';

export abstract class AbstractDatastructure implements DatasetInterface {
  abstract readonly sql: string;
  get table(): string {
    return (this.constructor as StaticAbstractDataset).table;
  }

  get tableWithSchema(): string {
    return `${this.targetSchema}.${this.table}`;
  }

  required: Set<StaticMigrable> = new Set();

  constructor(protected connection: Pool, protected file: FileProvider, protected targetSchema: string = 'public') {}

  async validate(done: Set<StaticMigrable>): Promise<void> {
    const difference = new Set([...this.required].filter((x) => !done.has(x)));
    if (difference.size > 0) {
      throw new ValidationError(
        this,
        `Cant apply this dataset, element is missing (${[...difference].map((d) => d.uuid).join(', ')})`,
      );
    }
  }

  async before(): Promise<void> {
    try {
      console.debug(this.sql);
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
