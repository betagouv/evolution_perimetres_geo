import { prepare, run } from './app';
import { config } from './config';

const migrator = prepare(config);
run(migrator);
