import { StaticMigrable } from '.';

export interface StateManagerInterface {
  plan(migrables: StaticMigrable[]): void;
  unplanAfter(after: StaticMigrable): void;
  todo(excludeStates?: State[]): Iterator<[StaticMigrable, State]>;
  get(state?: State): Set<StaticMigrable>;
  set(key: StaticMigrable, state?: State): void;
}

export enum State {
  Planned = 'planned',
  Validated = 'validated',
  Created = 'created',
  Downloaded = 'downloaded',
  Transformed = 'transformed',
  Loaded = 'loaded',
  Imported = 'imported',
  Done = 'done',
  Failed = 'failed',
  Unplanned = 'unplanned',
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
