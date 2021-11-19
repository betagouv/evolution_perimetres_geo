import { Pool } from 'pg';
import { StateManagerInterface } from '.';
import { FileManager } from '../providers';

export interface StaticMigrable {
  readonly uuid: string;
  readonly table: string;
  new (connection: Pool, file: FileManager, targetSchema: string): DatasetInterface;
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
