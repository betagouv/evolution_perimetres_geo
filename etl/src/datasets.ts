import { CeremaAom2019 } from './datasets/cerema/aom/2019/CeremaAom2019';
import { CeremaAom2020 } from './datasets/cerema/aom/2020/CeremaAom2020';
import { CeremaAom2021 } from './datasets/cerema/aom/2021/CeremaAom2021';
import { InseeCommune2021 } from './datasets/insee/commune/2021/InseeCommune2021';
import { CreateGeoTable } from './datastructure/000_CreateGeoTable';
import { CreateCityUpdateTable } from './datastructure/001_CreateCityUpdateTable';
import { Migrable } from './interfaces';

export const datasets: Set<Migrable> = new Set([
  CreateGeoTable,
  CreateCityUpdateTable,
  CeremaAom2019,
  CeremaAom2020,
  CeremaAom2021,
  InseeCommune2021,
]);
