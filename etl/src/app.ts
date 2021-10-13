import { Migrator } from './common/Migrator';
import { ConfigInterface } from './interfaces';
import { bootstrap, createPool, createLogger, createFileProvider } from './helpers';

export function prepare(config: ConfigInterface): Migrator {
  const logger = createLogger(config.logger);
  const fileProvider = createFileProvider(config.file);
  const pool = createPool(config.pool);
  bootstrap(logger, [async () => pool.end()]);
  const migrator = new Migrator(pool, fileProvider, config.app);
  return migrator;
}

export async function run(migrator: Migrator) {
  await migrator.prepare();
  await migrator.run();
}
