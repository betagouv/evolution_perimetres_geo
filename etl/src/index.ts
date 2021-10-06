import { Pool } from 'pg';
import { Migrator } from './common/Migrator';
import { datasets } from './datasets';
import { bootstrap, createPool, getLogger } from './helpers';

const logger = getLogger();
const pool = createPool();
bootstrap(logger, [async () => pool.end()]);
async function run(p: Pool) {
  const migrator = new Migrator(p, datasets);
  await migrator.prepare();
  await migrator.run();
}

run(pool);
