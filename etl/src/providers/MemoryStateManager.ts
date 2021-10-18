import { StateManagerInterface, StaticMigrable, State } from '../interfaces';

export class MemoryStateManager implements StateManagerInterface {
  protected state: Map<StaticMigrable, State> = new Map();

  constructor(done: Set<StaticMigrable> = new Set()) {
    for (const migrable of done) {
      this.state.set(migrable, State.Done);
    }
  }

  get(state: State = State.Done): Set<StaticMigrable> {
    const result: Set<StaticMigrable> = new Set();
    for (const [migrable, migrableState] of this.state) {
      if (migrableState === state) {
        result.add(migrable);
      }
    }
    return result;
  }

  set(key: StaticMigrable, state: State = State.Done): void {
    this.state.set(key, state);
  }
}
