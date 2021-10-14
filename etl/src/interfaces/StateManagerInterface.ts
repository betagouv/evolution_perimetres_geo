import { StaticMigrable } from '.';

export interface StateManagerInterface {
  get(): Promise<Set<StaticMigrable>>;
  set(key: StaticMigrable): Promise<void>;
}
