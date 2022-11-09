import anyTest, { TestFn } from 'ava';
import { Pool } from 'pg';
import { MemoryStateManager } from '../providers/MemoryStateManager';
import { AbstractDatatreatment } from '../common/AbstractDatatreatment';
import { createPool, createFileManager } from '../helpers';
import { PopulateGeoCentroid as Dataset } from './PopulateGeoCentroid';
import { Migrator } from '../Migrator';
import { CreateGeoTable } from '../datastructure/000_CreateGeoTable';
import { CreateGeoCentroidTable } from '../datastructure/002_CreateGeoCentroidTable';

interface TestContext {
  migrator: Migrator;
  connection: Pool;
  dataset: AbstractDatatreatment;
}

const test = anyTest as TestFn<TestContext>;

test.before(async (t) => {
  t.context.connection = createPool();
  t.context.migrator = new Migrator(t.context.connection, createFileManager(), {
    targetSchema: 'public',
    datastructures: new Set([CreateGeoTable, CreateGeoCentroidTable, Dataset]),
    datasets: new Set([]),
    noCleanup: false,
  });
  t.context.dataset = new Dataset(t.context.connection, createFileManager());
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
    `);
  await t.context.connection.query(`
      DROP TABLE IF EXISTS public.dataset_migration
    `);
  await t.context.migrator.prepare();
});

test.serial('should validate', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.validate(new MemoryStateManager()));
});

test.serial('should after', async (t) => {
  await t.context.migrator.run([CreateGeoTable, CreateGeoCentroidTable, Dataset]);
  const count = await t.context.connection.query(`SELECT count(*) FROM ${t.context.dataset.tableWithSchema}`);
  t.is(count.rows[0].count, '0');
});
