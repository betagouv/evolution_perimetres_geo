import { PoolConfig } from 'pg';
import { StaticMigrable } from '.';

export interface AppConfigInterface {
  targetSchema: string;
  migrations: Set<StaticMigrable>;
}

export interface FileProviderConfigInterface {
  basePath: string;
}

export interface LoggerConfigInterface {
  level: string;
}
export interface ConfigInterface {
  pool: PoolConfig;
  logger: LoggerConfigInterface;
  file: FileProviderConfigInterface;
  app: AppConfigInterface;
}

export interface PartialConfigInterface {
  pool: Partial<PoolConfig>;
  logger: Partial<LoggerConfigInterface>;
  file: Partial<FileProviderConfigInterface>;
  app: Partial<AppConfigInterface>;
}
