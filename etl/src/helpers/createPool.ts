import { Pool, PoolConfig } from 'pg';
import { pool } from '../config';

export function createPool(config: PoolConfig = pool): Pool {
  return new Pool({
    ...config,
  });
}
