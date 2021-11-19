import { Migrator } from './Migrator';
import { PartialConfigInterface } from './interfaces';
import { config as defaultConfig } from './config';
import { bootstrap, createPool, createLogger, createFileManager, createStateManager } from './helpers';

export function buildMigrator(userConfig: Partial<PartialConfigInterface>): Migrator {
  const logger = createLogger({ ...defaultConfig.logger, ...userConfig.logger });
  const FileManager = createFileManager({ ...defaultConfig.file, ...userConfig.file });
  const pool = createPool({ ...defaultConfig.pool, ...userConfig.pool });
  const appConfig = { ...defaultConfig.app, ...userConfig.app };
  const stateManager = createStateManager(pool, appConfig);
  bootstrap(logger, [async () => pool.end()]);
  const migrator = new Migrator(pool, FileManager, appConfig, stateManager);
  return migrator;
}
