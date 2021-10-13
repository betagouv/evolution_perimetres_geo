import { PoolConfig } from "pg";

export interface ConfigInterface {
    pool: PoolConfig;
    logger: {
        level: string;
    };
    temporaryDirectory: string;
    targetSchema: string;
}