import { PoolConfig } from 'pg';
import { Options as OraOptions } from 'ora';

export const pool: PoolConfig = {
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'local',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
};

export const spinner: OraOptions = {};

export const console = {
  level: process.env.LOG_LEVEL || 'debug',
};
