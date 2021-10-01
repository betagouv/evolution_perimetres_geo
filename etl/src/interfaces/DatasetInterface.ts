import { Pool } from 'pg';

export interface StaticAbstractDataset {
  readonly dataset: string;
  readonly year: number;

  new (connection: Pool): DatasetInterface;
}

export interface DatasetInterface {
  validate(datasets: Set<string>): Promise<void>;
  before(): Promise<void>;
  download(): Promise<void>;
  transform(): Promise<void>;
  load(): Promise<void>;
  import(): Promise<void>;
  after(): Promise<void>;
}
