import { Migrator, MigratorConfig } from './common/Migrator';
import { datasets } from './datasets';
import { bootstrap, createPool, getLogger } from './helpers';

export function prepare(): MigratorConfig {
  const logger = getLogger();
  const pool = createPool();
  bootstrap(logger, [async () => pool.end()]);
  return { pool, migrations: datasets };
}

export async function run(config: MigratorConfig) {
  const migrator = new Migrator(config);
  await migrator.prepare();
  await migrator.run();
}
