import { CeremaAom2019 } from './datasets/cerema/aom/2019/CeremaAom2019';
import { CeremaAom2020 } from './datasets/cerema/aom/2020/CeremaAom2020';
import { CeremaAom2021 } from './datasets/cerema/aom/2021/CeremaAom2021';
import { InseeDep2021 } from './datasets/insee/departements/2021/InseeDep2021';
import { InseeMvtcom2021 } from './datasets/insee/mvt_communaux/2021/InseeMvtcom2021';
import { InseePays2021 } from './datasets/insee/pays/2021/InseePays2021';
import { InseePerim2019 } from './datasets/insee/perimetres/2019/InseePerim2019';
import { InseePerim2020 } from './datasets/insee/perimetres/2020/InseePerim2020';
import { InseePerim2021 } from './datasets/insee/perimetres/2021/InseePerim2021';
import { InseeReg2021 } from './datasets/insee/regions/2021/InseeReg2021';
import { CreateGeoTable } from './datastructure/000_CreateGeoTable';
import { CreateCityUpdateTable } from './datastructure/001_CreateCityUpdateTable';
import { Migrable } from './interfaces';

export const datasets: Set<Migrable> = new Set([
  CreateGeoTable,
  CreateCityUpdateTable,
  CeremaAom2019,
  CeremaAom2020,
  CeremaAom2021,
  InseeDep2021,
  InseeMvtcom2021,
  InseePays2021,
  InseePerim2019,
  InseePerim2020,
  InseePerim2021,
  InseeReg2021,
]);
