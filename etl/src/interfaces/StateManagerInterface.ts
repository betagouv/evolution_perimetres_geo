import { StaticMigrable } from '.';

export interface StateManagerInterface {
  get(state?: State): Set<StaticMigrable>;
  set(key: StaticMigrable, state?: State): void;
}

export enum State {
  Validated,
  Created,
  Downloaded,
  Transformed,
  Loaded,
  Imported,
  Done,
}
