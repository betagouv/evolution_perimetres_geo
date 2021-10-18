import { Pool } from 'pg';
import { FileProvider } from '../providers/FileProvider';
import { StaticMigrable, AppConfigInterface, State, StateManagerInterface } from '../interfaces';
import { DatabaseStateManager } from '../providers/DatabaseStateManager';

export class Migrator {
  protected dbStateManager: DatabaseStateManager;

  constructor(readonly pool: Pool, readonly file: FileProvider, readonly config: AppConfigInterface) {
    this.dbStateManager = new DatabaseStateManager(this.pool, this.config);
  }

  async prepare(): Promise<void> {
    console.info(`Connecting to database`);
    await this.pool.connect();
    console.info(`Connected!`);
    await this.dbStateManager.install();
  }

  async todo(state: StateManagerInterface): Promise<Set<StaticMigrable>> {
    const done = state.get(State.Done);
    return new Set([...this.config.migrations].filter((m) => !done.has(m)));
  }

  async process(migrable: StaticMigrable, state: StateManagerInterface): Promise<void> {
    try {
      console.info(`${migrable.uuid} : start processing`);
      const migableInstance = new migrable(this.pool, this.file, this.config.targetSchema);
      console.debug(`${migrable.uuid} : validation`);
      await migableInstance.validate(state);
      state.set(migrable, State.Validated);
      console.debug(`${migrable.uuid} : before`);
      await migableInstance.before();
      state.set(migrable, State.Created);
      console.debug(`${migrable.uuid} : download`);
      await migableInstance.download();
      state.set(migrable, State.Downloaded);
      console.debug(`${migrable.uuid} : transform`);
      await migableInstance.transform();
      state.set(migrable, State.Transformed);
      console.debug(`${migrable.uuid} : load`);
      await migableInstance.load();
      state.set(migrable, State.Loaded);
      console.debug(`${migrable.uuid} : import`);
      await migableInstance.import();
      state.set(migrable, State.Imported);
      console.debug(`${migrable.uuid} : after`);
      await migableInstance.after();
      state.set(migrable, State.Done);
      console.info(`${migrable.uuid} : done`);
    } catch (e) {
      console.error(`${migrable.uuid} : ${(e as Error).message}`);
      throw e;
    }
  }

  async run(): Promise<void> {
    const state = await this.dbStateManager.toMemory();
    const migrables = await this.todo(state);
    for await (const migrable of migrables) {
      await this.process(migrable, state);
    }
    await this.dbStateManager.fromMemory(state);
  }
}
