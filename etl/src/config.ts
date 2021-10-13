import os from 'os';
import { ConfigInterface } from './interfaces/ConfigInterface';

export const config: ConfigInterface = {
  pool: {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'local',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  },
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
  },
  temporaryDirectory: process.env.TEMPORARY_DIRECTORY || os.tmpdir(),
  targetSchema: 'public',
}
