import { Pool } from 'pg';

export interface Migrable {
  readonly uuid: string;
  readonly table: string;
  new (connection: Pool): DatasetInterface;
}
export interface StaticAbstractDataset extends Migrable {
  readonly producer: string;
  readonly dataset: string;
  readonly year: number;
}

export interface DatasetInterface {
  validate(done: Set<Migrable>): Promise<void>;
  before(): Promise<void>;
  download(): Promise<void>;
  transform(): Promise<void>;
  load(): Promise<void>;
  import(): Promise<void>;
  after(): Promise<void>;
}
