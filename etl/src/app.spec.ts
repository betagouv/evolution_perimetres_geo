import anyTest, { TestInterface } from 'ava';
import { Pool } from 'pg';
import { prepare, run } from './app';
import { Migrator } from './common/Migrator';
import { EurostatCountries2020 } from './datasets/eurostat/countries/2020/EurostatCountries2020';
import { InseePerim2019 } from './datasets/insee/perimetres/2019/InseePerim2019';
import { IgnAe2019 } from './datasets/ign/admin_express/2019/IgnAe2019';
import { IgnAe2020 } from './datasets/ign/admin_express/2020/IgnAe2020';
import { IgnAe2021 } from './datasets/ign/admin_express/2021/IgnAe2021';
import { CreateGeoTable } from './datastructure/000_CreateGeoTable';
import { createPool } from './helpers';
import { InseePerim2020 } from './datasets/insee/perimetres/2020/InseePerim2020';
import { InseePerim2021 } from './datasets/insee/perimetres/2021/InseePerim2021';
import { InseeDep2021 } from './datasets/insee/departements/2021/InseeDep2021';
import { InseeReg2021 } from './datasets/insee/regions/2021/InseeReg2021';
import { CeremaAom2019 } from './datasets/cerema/aom/2019/CeremaAom2019';
import { CeremaAom2020 } from './datasets/cerema/aom/2020/CeremaAom2020';
import { CeremaAom2021 } from './datasets/cerema/aom/2021/CeremaAom2021';
import { config } from './config';

interface TestContext {
  connection: Pool;
  migrator: Migrator;
}

const test = anyTest as TestInterface<TestContext>;

test.before(async (t) => {
  t.context.migrator = prepare(config);
  t.context.connection = t.context.migrator.pool;
  for await (const migrable of t.context.migrator.migrations.values()) {
    await t.context.connection.query(`
        DROP TABLE IF EXISTS ${config.app.targetSchema}.${migrable.table}
      `);
  }
});

test.after.always(async (t) => {
  /*for await (const migrable of t.context.migrator.migrations.values()) {
    await t.context.connection.query(`
        DROP TABLE IF EXISTS ${config.app.targetSchema}.${migrable.table}
      `);
  }*/
});
test.serial('should create perimeters table', async (t) => {
  // this is an example
  await t.context.migrator.process(CreateGeoTable);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters`);
  t.is(result.rows[0].count, '0');
});

/*test.serial('should do migration IgnAe2019', async (t) => {
  await t.context.migrator.process(IgnAe2019);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where year = 2019`);
  t.is(result.rows[0].count, '34886');
});*/

/*test.serial('should do migration IgnAe2020', async (t) => {
  await t.context.migrator.process(IgnAe2020);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where year = 2020`);
  t.is(result.rows[0].count, '34884');
});*/

test.serial('should do migration IgnAe2021', async (t) => {
  await t.context.migrator.process(IgnAe2021);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where year = 2021`);
  t.is(result.rows[0].count, '34881');
});

test.serial.skip('should do migration EurostatCountries2020', async (t) => {
  await t.context.migrator.process(EurostatCountries2020);
  const result = await t.context.connection.query(`SELECT count(*) FROM eurostat_countries_2020`);
  t.is(result.rows[0].count, '257');
});

/*test.serial('should do migration InseePerim2019', async (t) => {
  await t.context.migrator.process(InseePerim2019);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where l_arr IS NOT NULL AND year = 2019`);
  t.is(result.rows[0].count, '34886');
});*/

/*test.serial('should do migration InseePerim2020', async (t) => {
  await t.context.migrator.process(InseePerim2020);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where l_arr IS NOT NULL AND year = 2020`);
  t.is(result.rows[0].count, '34839');
});*/

test.serial('should do migration InseePerim2021', async (t) => {
  await t.context.migrator.process(InseePerim2021);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where l_arr IS NOT NULL AND year = 2021`);
  t.is(result.rows[0].count, '34881');
});

test.serial('should do migration InseeDep2021', async (t) => {
  await t.context.migrator.process(InseeDep2021);
  const result = await t.context.connection.query(`SELECT count(distinct l_dep) FROM perimeters`);
  t.is(result.rows[0].count, '96');
});

test.serial('should do migration InseeReg2021', async (t) => {
  await t.context.migrator.process(InseeReg2021);
  const result = await t.context.connection.query(`SELECT count(distinct l_reg) FROM perimeters`);
  t.is(result.rows[0].count, '13');
});

/*test.serial('should do migration CeremaAom2019', async (t) => {
  await t.context.migrator.process(CeremaAom2019);
  const result = await t.context.connection.query(`SELECT count(distinct l_aom) FROM perimeters`);
  t.is(result.rows[0].count, '323');
});*/

/*test.serial('should do migration CeremaAom2020', async (t) => {
  await t.context.migrator.process(CeremaAom2020);
  const result = await t.context.connection.query(`SELECT count(distinct l_aom) FROM perimeters`);
  t.is(result.rows[0].count, '260');
});*/

test.serial('should do migration CeremaAom2021', async (t) => {
  await t.context.migrator.process(CeremaAom2021);
  const result = await t.context.connection.query(`SELECT count(distinct l_aom) FROM perimeters`);
  t.is(result.rows[0].count, '323');
});

test.serial.skip('should import', async (t) => {
  await run(t.context.migrator);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters`);
  t.is(result.rows[0].count, '404');
});
