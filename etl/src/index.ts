import { Pool } from 'pg';
import { Migrator } from './common/Migrator';
import { datasets } from './datasets';
import { bootstrap, createPool, getLogger } from './helpers';

const logger = getLogger();
const pool = createPool();
bootstrap(logger, [async () => pool.end()]);
async function run(p: Pool) {
  const migrator = new Migrator(p, datasets);
bootstrap(getConsole(), [async () => pool.end()]);
const migrator = new Migrator(pool, datasets);
migrator.run();
  await migrator.run();
}

run(pool);
