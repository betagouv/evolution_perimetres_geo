import { Pool } from 'pg';

export interface StaticMigrable {
  readonly uuid: string;
  readonly table: string;
  new (connection: Pool): DatasetInterface;
}
export interface StaticAbstractDataset extends StaticMigrable {
  readonly producer: string;
  readonly dataset: string;
  readonly year: number;
}

export interface DatasetInterface {
  validate(done: Set<StaticMigrable>): Promise<void>;
  before(): Promise<void>;
  download(): Promise<void>;
  transform(): Promise<void>;
  load(): Promise<void>;
  import(): Promise<void>;
  after(): Promise<void>;
}
