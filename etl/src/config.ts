import os from 'os';
import { datasets } from './datasets';
import { ConfigInterface } from './interfaces/ConfigInterface';

export const config: ConfigInterface = {
  pool: {
    connectionString: process.env.POSTGRES_URL,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'local',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  },
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
  },
  file: {
    basePath: process.env.CACHE_DIRECTORY || os.tmpdir(),
    downloadPath: process.env.DOWNLOAD_DIRECTORY,
    mirrorUrl: process.env.MIRROR_URL,
  },
  app: {
    noCleanup: false,
    targetSchema: process.env.POSTGRES_SCHEMA || 'public',
    migrations: datasets,
    sevenZipBinPath: process.env.SEVEN_ZIP_BIN_PATH,
  },
};
