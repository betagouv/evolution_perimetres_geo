import { CreateGeoTable } from '../datastructure/000_CreateGeoTable';
import { StaticMigrable } from 'src/interfaces';
import { AbstractDatafunction } from '../common/AbstractDatafunction';

export class CreateGetLatestMillesimeFunction extends AbstractDatafunction {
  static uuid = 'create_get_latest_millesime_function';
  static table = 'get_latest_millesime';
  static year = 2022;
  readonly required: Set<StaticMigrable> = new Set([CreateGeoTable]);
  readonly sql = `
    CREATE OR REPLACE FUNCTION ${this.functionWithSchema}() returns smallint as $$
      SELECT 
        max(year)
      FROM ${this.targetTableWithSchema}
    $$ language sql;
  `;
}