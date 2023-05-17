import anyTest, { TestFn } from 'ava';
import { access } from 'fs/promises';
import { Pool } from 'pg';
import { MemoryStateManager } from '../../../../providers/MemoryStateManager';
import { AbstractDataset } from '../../../../common/AbstractDataset';
import { createPool, createFileManager } from '../../../../helpers';
import { InseeDep2023 as Dataset } from './InseeDep2023';

interface TestContext {
  connection: Pool;
  dataset: AbstractDataset;
}

const test = anyTest as TestFn<TestContext>;

test.before(async (t) => {
  t.context.connection = createPool();
  t.context.dataset = new Dataset(t.context.connection, createFileManager());
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
    `);
});

test.after.always(async (t) => {
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
    `);
});

test.serial('should validate', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.validate(new MemoryStateManager()));
});

test.serial('should prepare', async (t) => {
  await t.context.dataset.before();
  const query = `SELECT * FROM ${t.context.dataset.tableWithSchema}`;
  t.log(query);
  await t.notThrowsAsync(() => t.context.connection.query(query));
});

test.serial('should download file', async (t) => {
  await t.context.dataset.download();
  t.true(t.context.dataset.filepaths.length >= 1);
  for (const path of t.context.dataset.filepaths) {
    await t.notThrowsAsync(() => access(path));
  }
});

test.serial('should transform', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.transform());
});

test.serial('should load', async (t) => {
  await t.context.dataset.load();
  const first = await t.context.connection.query(`
  SELECT * FROM ${t.context.dataset.tableWithSchema} order by dep asc limit 1
  `);
  t.is(first.rows[0].libelle, 'Ain');
  const last = await t.context.connection.query(`
  SELECT * FROM ${t.context.dataset.tableWithSchema} order by dep desc limit 1
  `);
  t.is(last.rows[0].libelle, 'Mayotte');
  const count = await t.context.connection.query(`
    SELECT count(*) FROM ${t.context.dataset.tableWithSchema}
  `);
  t.is(count.rows[0].count, '101');
});

test.serial('should cleanup', async (t) => {
  await t.context.dataset.after();
  const query = `SELECT * FROM ${t.context.dataset.tableWithSchema}`;
  await t.throwsAsync(() => t.context.connection.query(query));
});
