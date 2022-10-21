import { CreateGeoTable } from '../datastructure/000_CreateGeoTable';
import { StaticMigrable } from 'src/interfaces';
import { AbstractDatafunction } from '../common/AbstractDatafunction';

export class CreateGetLatestMillesimeOrFunction extends AbstractDatafunction {
  static uuid = 'create_get_latest_millesime_or_function';
  static table = 'get_latest_millesime_or';
  static year = 2022;
  readonly required: Set<StaticMigrable> = new Set([CreateGeoTable]);
  readonly sql = `
    CREATE OR REPLACE FUNCTION ${this.functionWithSchema}(l smallint) returns smallint as $$
      SELECT max(year) as year FROM ${this.targetTableWithSchema} WHERE year = $1
      UNION ALL
      SELECT max(year) as year FROM ${this.targetTableWithSchema}
      ORDER BY year
      LIMIT 1
    $$ language sql;
  `;
}
