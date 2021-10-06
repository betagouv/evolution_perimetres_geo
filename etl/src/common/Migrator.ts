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
    const timer = this.logger.start(`Processing ${migrable.uuid}`);
    const state = await this.getState();
    const migableInstance = new migrable(this.pool);

    const validateTimer = timer.start('Validation');
    await migableInstance.validate(state);
    validateTimer.stop();

    const beforeTimer = timer.start('Before');
    await migableInstance.before();
    beforeTimer.stop();

    const downloadTimer = timer.start('Starting download');
    await migableInstance.download();
    downloadTimer.stop();

    const transformTimer = timer.start('Transform');
    await migableInstance.transform();
    transformTimer.stop();

    const loadTimer = timer.start('Load');
    await migableInstance.load();
    loadTimer.stop();

    const importTimer = timer.start('Import');
    await migableInstance.import();
    importTimer.stop();

    const afterTimer = timer.start('After');
    await migableInstance.after();
    afterTimer.stop();

    timer.stop();
  }

  async run(): Promise<void> {
    const migrables = await this.todo();
    for await (const migrable of migrables) {
      await this.process(migrable);
    }
  }
}
