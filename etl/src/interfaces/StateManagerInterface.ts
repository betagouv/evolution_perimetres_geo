import { StaticMigrable } from '.';

export interface StateManagerInterface {
  plan(migrables: StaticMigrable[]): void;
  unplanAfter(after: StaticMigrable): void;
  todo(excludeStates?: State[]): Iterator<[StaticMigrable, State]>;
  get(state?: State): Set<StaticMigrable>;
  set(key: StaticMigrable, state?: State): void;
}

export enum State {
  Planned,
  Validated,
  Created,
  Downloaded,
  Transformed,
  Loaded,
  Imported,
  Done,
  Failed,
  Unplanned,
}

export const flow = [
  State.Planned,
  State.Validated,
  State.Created,
  State.Downloaded,
  State.Transformed,
  State.Loaded,
  State.Imported,
  State.Done,
];
