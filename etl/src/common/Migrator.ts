import { Pool } from 'pg';
import { FileProvider } from '../providers/FileProvider';
import { StaticMigrable, AppConfigInterface } from '../interfaces';
import { MigratorState } from './MigratorState';

export class Migrator {
  protected state: MigratorState;

  readonly migrations: Map<string, StaticMigrable>;

  constructor(readonly pool: Pool, readonly file: FileProvider, readonly config: AppConfigInterface) {
    this.state = new MigratorState(this.pool, this.config.targetSchema);
    this.migrations = new Map([...this.config.migrations].map((m) => [m.uuid, m]));
  }

  async prepare(): Promise<void> {
    console.info(`Connecting to database`);
    await this.pool.connect();
    console.info(`Connected!`);
    await this.state.install();
  }

  async getState(): Promise<Set<StaticMigrable>> {
    const stateUuid = await this.state.get();
    const state: Set<StaticMigrable> = new Set();
    for (const uuid of stateUuid) {
      const migration = this.migrations.get(uuid);
      if (!migration) {
        throw new Error(`Migration not found ${uuid}`);
      }
      state.add(migration);
    }
    return state;
  }

  async todo(): Promise<Set<StaticMigrable>> {
    const done = await this.state.get();
    return new Set([...this.migrations.values()].filter((m) => !done.has(m.uuid)));
  }

  async process(migrable: StaticMigrable): Promise<void> {
    try {
      console.info(`${migrable.uuid} : start processing`);
      const state = await this.getState();
      const migrableInstance = new migrable(this.pool, this.file, this.config.targetSchema);
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
    }
  }
}
