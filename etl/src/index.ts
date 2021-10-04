import { Migrator } from './common/Migrator';
import { datasets } from './datasets';
import { createPool } from './helpers';

const pool = createPool();
const migrator = new Migrator(pool, datasets);
migrator.run();
