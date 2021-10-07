import { DatasetInterface, StaticAbstractDataset } from '../interfaces';

export class MigrableError extends Error {
  constructor(migrable: DatasetInterface, message: string) {
    super(`[${(migrable.constructor as StaticAbstractDataset).uuid}] ${message}`);
  }
}
