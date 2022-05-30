import { PoolConfig } from 'pg';
import { StaticMigrable } from '.';

export interface AppConfigInterface {
  targetSchema: string;
  noCleanup: boolean;
  migrations: Set<StaticMigrable>;
  sevenZipBinPath?: string;
}

export interface FileManagerConfigInterface {
  basePath: string;
}

export interface LoggerConfigInterface {
  level: string;
}
export interface ConfigInterface {
  pool: PoolConfig;
  logger: LoggerConfigInterface;
  file: FileManagerConfigInterface;
  app: AppConfigInterface;
}

export interface PartialConfigInterface {
  pool: Partial<PoolConfig>;
  logger: Partial<LoggerConfigInterface>;
  file: Partial<FileManagerConfigInterface>;
  app: Partial<AppConfigInterface>;
}
