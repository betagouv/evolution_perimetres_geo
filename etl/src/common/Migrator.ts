import { Pool } from 'pg';
import { FileProvider } from '../providers/FileProvider';
import { StaticMigrable, AppConfigInterface, StateManagerInterface } from '../interfaces';
import { DatabaseStateManager } from '../providers/DatabaseStateManager';
import { MemoryStateManager } from 'src/providers/MemoryStateManager';

export class Migrator {
  protected dbStateManager: DatabaseStateManager;
  protected runStateManager: StateManagerInterface;

  constructor(readonly pool: Pool, readonly file: FileProvider, readonly config: AppConfigInterface) {
    this.dbStateManager = new DatabaseStateManager(this.pool, this.config);
    this.runStateManager = new MemoryStateManager();
  }

  async prepare(): Promise<void> {
    console.info(`Connecting to database`);
    await this.pool.connect();
    console.info(`Connected!`);
    await this.dbStateManager.install();
  }

  async todo(): Promise<Set<StaticMigrable>> {
    const done = await this.dbStateManager.get();
    return new Set([...this.config.migrations].filter((m) => !done.has(m)));
  }

  async process(migrable: StaticMigrable): Promise<void> {
    try {
      console.info(`${migrable.uuid} : start processing`);
      const state = await this.runStateManager.get();
      const migableInstance = new migrable(this.pool, this.file, this.config.targetSchema);
      console.debug(`${migrable.uuid} : validation`);
      await migrableInstance.validate(state);
      console.debug(`${migrable.uuid} : before`);
      await migrableInstance.before();
      console.debug(`${migrable.uuid} : download`);
      await migrableInstance.download();
      console.debug(`${migrable.uuid} : transform`);
      await migrableInstance.transform();
      console.debug(`${migrable.uuid} : load`);
      await migrableInstance.load();
      console.debug(`${migrable.uuid} : import`);
      await migrableInstance.import();
      console.debug(`${migrable.uuid} : after`);
      await migrableInstance.after();
      await this.state.set(migrable.uuid);
      console.info(`${migrable.uuid} : done`);
    } catch (e) {
      console.error(`${migrable.uuid} : ${(e as Error).message}`);
      throw e;
    }
  }

  async run(): Promise<void> {
    const migrables = await this.todo();
    for await (const migrable of migrables) {
      await this.process(migrable);
      await this.dbStateManager.set(migrable);
    }
  }
}
