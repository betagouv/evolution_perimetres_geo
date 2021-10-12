import anyTest, { TestInterface } from 'ava';
import { Pool } from 'pg';
import { prepare, run } from './app';
import { Migrator } from './common/Migrator';
import { IgnAe2019 } from './datasets/ign/admin_express/2019/IgnAe2019';
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
  for await (const migrable of t.context.migrator.migrations.values()) {
    await t.context.connection.query(`
        DROP TABLE IF EXISTS ${migrable.table}
      `);
  }
});

test.serial('should do migration x', async (t) => {
  // this is an example
  await t.context.migrator.process(IgnAe2019);
});

test.serial('should import', async (t) => {
  await run(t.context.migrator);
  const result = await t.context.connection.query(`SELECT count(*) FROM perimeters`);
  t.is(result.rows[0].count, '404');
});
