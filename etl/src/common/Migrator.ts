import { Pool } from 'pg';
import { FileProvider } from '../providers/FileProvider';
import {
  StaticMigrable,
  AppConfigInterface,
  State,
  StateManagerInterface,
  DatasetInterface,
  flow,
} from '../interfaces';
import { DatabaseStateManager } from '../providers/DatabaseStateManager';

export class Migrator {
  protected dbStateManager: DatabaseStateManager;
  protected migrableInstances: Map<StaticMigrable, DatasetInterface> = new Map();

  constructor(readonly pool: Pool, readonly file: FileProvider, readonly config: AppConfigInterface) {
    this.dbStateManager = new DatabaseStateManager(this.pool, this.config);
  }

  async prepare(): Promise<void> {
    console.info(`Connecting to database`);

    const client = await this.pool.connect();
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${this.config.targetSchema}`);
    client.release();

    console.info(`Connected!`);
    await this.dbStateManager.install();
  }

  protected getInstance(ctor: StaticMigrable): DatasetInterface {
    if (!this.migrableInstances.has(ctor)) {
      const migrable = new ctor(this.pool, this.file, this.config.targetSchema);
      this.migrableInstances.set(ctor, migrable);
    }
    return this.migrableInstances.get(ctor) as DatasetInterface;
  }

  getTodo(state: StateManagerInterface): StaticMigrable[] {
    const done = state.get(State.Done);
    return [...this.config.migrations].filter((m) => !done.has(m));
  }

  async do(migrable: DatasetInterface, migrableState: State, stateManager: StateManagerInterface): Promise<void> {
    const migrableCtor = migrable.constructor as StaticMigrable;
    switch (migrableState) {
      case State.Planned:
        console.info(`${migrableCtor.uuid} : start processing`);
        await migrable.validate(stateManager);
        stateManager.set(migrableCtor, State.Validated);
        break;
      case State.Validated:
        console.debug(`${migrableCtor.uuid} : before`);
        await migrable.before();
        stateManager.set(migrableCtor, State.Created);
        break;
      case State.Created:
        console.debug(`${migrableCtor.uuid} : download`);
        await migrable.download();
        stateManager.set(migrableCtor, State.Downloaded);
        break;
      case State.Downloaded:
        console.debug(`${migrableCtor.uuid} : transform`);
        await migrable.transform();
        stateManager.set(migrableCtor, State.Transformed);
        break;
      case State.Transformed:
        console.debug(`${migrableCtor.uuid} : load`);
        await migrable.load();
        stateManager.set(migrableCtor, State.Loaded);
        break;
      case State.Loaded:
        console.debug(`${migrableCtor.uuid} : import`);
        await migrable.import();
        stateManager.set(migrableCtor, State.Imported);
        break;
      case State.Imported:
        console.debug(`${migrableCtor.uuid} : after`);
        await migrable.after();
        stateManager.set(migrableCtor, State.Done);
        break;
      case State.Done:
        console.info(`${migrableCtor.uuid} : done`);
        break;
      default:
        throw new Error();
    }
  }

  async process(migrableCtor: StaticMigrable, stateManager: StateManagerInterface): Promise<void> {
    try {
      const migrable = this.getInstance(migrableCtor);
      for (const state of [...flow]) {
        await this.do(migrable, state, stateManager);
      }
    } catch (e) {
      console.error(`${migrableCtor.uuid} : ${(e as Error).message}`);
      throw e;
    }
  }

  async run(todo?: StaticMigrable[]): Promise<void> {
    const state = await this.dbStateManager.toMemory();
    state.plan(todo || this.getTodo(state));
    const iter = state.todo();
    let done = false;
    do {
      const { value, done: isDone } = iter.next();
      if (isDone) {
        done = true;
      }
      if (value) {
        const [migrableCtor, migrableState] = value;
        const migrable = this.getInstance(migrableCtor);
        await this.do(migrable, migrableState, state);
      }
    } while (!done);
    await this.dbStateManager.fromMemory(state);
  }
}
