import { Migrator } from './common/Migrator';
import { datasets } from './datasets';
import { bootstrap, createPool, getConsole } from './helpers';

const pool = createPool();
bootstrap(getConsole(), [ async() => pool.end()]);
const migrator = new Migrator(pool, datasets);
migrator.run();
