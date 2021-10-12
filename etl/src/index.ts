import { prepare, run } from './app';

const migrator = prepare();
run(migrator);
