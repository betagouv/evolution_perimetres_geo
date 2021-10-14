import anyTest, { TestInterface } from 'ava';
import { Pool } from 'pg';
import { StaticMigrable } from '../interfaces';
import { createPool } from '../helpers';
import { DatabaseStateManager as StateManager } from './DatabaseStateManager';

interface TestContext {
  connection: Pool;
  migrator: StateManager;
}

const test = anyTest as TestInterface<TestContext>;

const FakeMigrable = { uuid: 'key' } as unknown as StaticMigrable;

test.before(async (t) => {
  t.context.connection = createPool();
  t.context.migrator = new StateManager(t.context.connection, {
    targetSchema: 'public',
    migrations: new Set([FakeMigrable]),
  });
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.migrator.table}
    `);
});

test.after.always(async (t) => {
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.migrator.table}
    `);
});

test.serial('should install', async (t) => {
  await t.context.migrator.install();
  const query = `SELECT * FROM ${t.context.migrator.table}`;
  t.log(query);
  await t.notThrowsAsync(() => t.context.connection.query(query));
});

test.serial('should set key', async (t) => {
  await t.context.migrator.set(FakeMigrable);
  const query = `SELECT key FROM ${t.context.migrator.table}`;
  t.log(query);
  const result = await t.context.connection.query(query);
  t.deepEqual(result.rows, [{ key: 'key' }]);
});

test.serial('should do nothing if conflict', async (t) => {
  await t.context.migrator.set(FakeMigrable);
  const query = `SELECT key FROM ${t.context.migrator.table}`;
  t.log(query);
  const result = await t.context.connection.query(query);
  t.deepEqual(result.rows, [{ key: 'key' }]);
});

test.serial('should get keys', async (t) => {
  const result = await t.context.migrator.get();
  t.deepEqual(result, new Set([FakeMigrable]));
});
