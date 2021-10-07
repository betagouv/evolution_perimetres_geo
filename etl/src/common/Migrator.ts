import { Ora } from 'ora';
import { Pool } from 'pg';
import { getSpinner } from '../helpers';
import { Migrable } from '../interfaces';
import { MigratorState } from './MigratorState';

export class Migrator {
  protected state: MigratorState;
  protected logger: Ora;
  protected migrations: Map<string, Migrable>;

  constructor(protected pool: Pool, migrations: Set<Migrable>) {
    this.state = new MigratorState(pool);
    this.logger = getSpinner();
    this.migrations = new Map([...migrations].map((m) => [m.uuid, m]));
  }

  async prepare(): Promise<void> {
    console.info(`Connecting to database`);
    await this.pool.connect();
    console.info(`Connected!`);
    await this.state.install();
  }

  async getState(): Promise<Set<Migrable>> {
    const stateUuid = await this.state.get();
    const state: Set<Migrable> = new Set();
    for (const uuid of stateUuid) {
      const migration = this.migrations.get(uuid);
      if (!migration) {
        throw new Error(`Migration not found ${uuid}`);
      }
      state.add(migration);
    }
    return state;
  }

  async todo(): Promise<Set<Migrable>> {
    const done = await this.state.get();
    return new Set([...this.migrations.values()].filter((m) => !done.has(m.uuid)));
  }

  async process(migrable: Migrable): Promise<void> {
    try {
      console.info(`${migrable.uuid} : start processing`);
      const state = await this.getState();
      const migableInstance = new migrable(this.pool);
      console.debug(`${migrable.uuid} : validation`);
      await migableInstance.validate(state);
      console.debug(`${migrable.uuid} : before`);
      await migableInstance.before();
      console.debug(`${migrable.uuid} : download`);
      await migableInstance.download();
      console.debug(`${migrable.uuid} : transform`);
      await migableInstance.transform();
      console.debug(`${migrable.uuid} : load`);
      await migableInstance.load();
      console.debug(`${migrable.uuid} : import`);
      await migableInstance.import();
      console.debug(`${migrable.uuid} : after`);
      await migableInstance.after();
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
