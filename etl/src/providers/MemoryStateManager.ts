import { StateManagerInterface, StaticMigrable, State, flow } from '../interfaces';

export class MemoryStateManager implements StateManagerInterface {
  protected state: Map<StaticMigrable, State> = new Map();

  constructor(done: Set<StaticMigrable> = new Set()) {
    for (const migrable of done) {
      this.state.set(migrable, State.Done);
    }
  }

  plan(migrables: StaticMigrable[]): void {
    for (const mig of migrables) {
      this.state.set(mig, State.Planned);
    }
  }

  *todo(): Iterator<[StaticMigrable, State]> {
    const fl = [...flow];
    fl.pop();
    for (const state of [...fl]) {
      let data: Set<StaticMigrable>;
      do {
        data = this.get(state);
        if (data.size > 0) {
          yield [[...data][0], state];
        }
      } while (data.size > 0);
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
