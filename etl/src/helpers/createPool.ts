import { Pool, PoolConfig } from "pg";

export function createPool(config: PoolConfig = {}): Pool {
    return new Pool({
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'postgres',
        database: process.env.PG_DATABASE || 'local',
        host: process.env.PG_HOST || '127.0.0.1',
        port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
        ...config,
    });
}
