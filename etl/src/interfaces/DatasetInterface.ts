import { Pool } from 'pg';
import { StateManagerInterface } from '.';
import { FileProvider } from '../providers/FileProvider';

export interface StaticMigrable {
  readonly uuid: string;
  table: string;
  new (connection: Pool, file: FileProvider, targetSchema: string): DatasetInterface;
}

export interface StaticAbstractDataset extends StaticMigrable {
  readonly producer: string;
  readonly dataset: string;
  readonly year: number;
}

export interface DatasetInterface {
  validate(state: StateManagerInterface): Promise<void>;
  before(): Promise<void>;
  download(): Promise<void>;
  transform(): Promise<void>;
  load(): Promise<void>;
  import(): Promise<void>;
  after(): Promise<void>;
}
