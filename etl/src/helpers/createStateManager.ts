import { AppConfigInterface } from '../interfaces';
import { config as defaultConfig } from '../config';
import { DatabaseStateManager } from '../providers';
import { Pool } from 'pg';

export function createStateManager(pool: Pool, config: AppConfigInterface = defaultConfig.app): DatabaseStateManager {
  return new DatabaseStateManager(pool, config);
}
