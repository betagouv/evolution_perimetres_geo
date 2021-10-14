import { StateManagerInterface, StaticMigrable } from '../interfaces';

export class MemoryStateManager implements StateManagerInterface {
  protected state: Set<StaticMigrable> = new Set();

  constructor() {}

  async get(): Promise<Set<StaticMigrable>> {
    return this.state;
  }

  async set(key: StaticMigrable): Promise<void> {
    if (!this.state.has(key)) {
      this.state.add(key);
    }
  }
}
