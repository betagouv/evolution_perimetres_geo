import anyTest, { TestInterface } from 'ava';
import { Pool } from 'pg';
import { prepare, run } from './app';
import { Migrator } from './common/Migrator';
//import { IgnAe2019 } from './datasets/ign/admin_express/2019/IgnAe2019';
//import { IgnAe2020 } from './datasets/ign/admin_express/2020/IgnAe2020';
//import { IgnAe2021 } from './datasets/ign/admin_express/2021/IgnAe2021';
//import { CreateGeoTable } from './datastructure/000_CreateGeoTable';
import { createPool } from './helpers';

interface TestContext {
  connection: Pool;
  migrator: Migrator;
}

const test = anyTest as TestInterface<TestContext>;

test.before(async (t) => {
  const pool = createPool();
  t.context.migrator = prepare({ pool });
  t.context.connection = pool;
  for await (const migrable of t.context.migrator.migrations.values()) {
    await t.context.connection.query(`
        DROP TABLE IF EXISTS ${migrable.table}
      `);
  }
});

test.after.always(async (t) => {
  /*for await (const migrable of t.context.migrator.migrations.values()) {
    await t.context.connection.query(`
        DROP TABLE IF EXISTS ${migrable.table}
      `);
  }*/
});
/*test.serial('should create perimeters table', async (t) => {
  // this is an example
  await t.context.migrator.process(CreateGeoTable);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters`);
  t.is(result.rows[0].count, '0');
});

test.serial('should do migration IgnAe2019', async (t) => {
  await t.context.migrator.process(IgnAe2019);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where year = 2019`);
  t.is(result.rows[0].count, '34886');
});

test.serial('should do migration IgnAe2020', async (t) => {
  await t.context.migrator.process(IgnAe2020);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where year = 2020`);
  t.is(result.rows[0].count, '34884');
});

test.serial('should do migration IgnAe2021', async (t) => {
  await t.context.migrator.process(IgnAe2021);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters where year = 2021`);
  t.is(result.rows[0].count, '34881');
});*/

test.serial('should import', async (t) => {
  await run(t.context.migrator);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters`);
  t.is(result.rows[0].count, '404');
});
