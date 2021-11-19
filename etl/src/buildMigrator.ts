import { Migrator } from './Migrator';
import { PartialConfigInterface } from './interfaces';
import { config as defaultConfig } from './config';
import { bootstrap, createPool, createLogger, createFileProvider, createStateManager } from './helpers';

export function buildMigrator(userConfig: Partial<PartialConfigInterface>): Migrator {
  const logger = createLogger({ ...defaultConfig.logger, ...userConfig.logger });
  const fileProvider = createFileProvider({ ...defaultConfig.file, ...userConfig.file });
  const pool = createPool({ ...defaultConfig.pool, ...userConfig.pool });
  const appConfig = { ...defaultConfig.app, ...userConfig.app };
  const stateManager = createStateManager(pool, appConfig);
  bootstrap(logger, [async () => pool.end()]);
  const migrator = new Migrator(pool, fileProvider, appConfig, stateManager);
  return migrator;
}
