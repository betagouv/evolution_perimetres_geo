import { Migrator, MigratorConfig } from './common/Migrator';
import { datasets } from './datasets';
import { bootstrap, createPool, getLogger } from './helpers';

export function prepare(config: Partial<MigratorConfig> = {}): Migrator {
  const logger = getLogger();
  const pool = config.pool || createPool();
  bootstrap(logger, [async () => pool.end()]);
  const migrator = new Migrator({ pool, migrations: datasets, ...config });
  return migrator;
}

export async function run(migrator: Migrator) {
  await migrator.prepare();
  await migrator.run();
}
