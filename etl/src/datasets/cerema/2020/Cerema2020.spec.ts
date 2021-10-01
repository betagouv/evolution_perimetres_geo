import anyTest, { TestInterface } from 'ava';
import { access } from 'fs/promises';
import { Pool } from 'pg';
import { AbstractDataset } from '../../../common/AbstractDataset';
import { createPool } from '../../../helpers';
import { Cerema2020 } from './Cerema2020';

interface TestContext {
  connection: Pool;
  dataset: AbstractDataset;
}

const test = anyTest as TestInterface<TestContext>;

test.before(async (t) => {
  t.context.connection = createPool();
  t.context.dataset = new Cerema2020(t.context.connection);
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.table}
    `);
});

test.after.always(async (t) => {
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.table}
    `);
});

test.serial.skip('should validate', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.validate(new Set()));
});

test.serial('should prepare', async (t) => {
  await t.context.dataset.before();
  const query = `SELECT * FROM ${t.context.dataset.table}`;
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
  const response = await t.context.connection.query(`
      SELECT count(*) FROM ${t.context.dataset.table}
    `);
  t.is(response.rows[0].count, '34964');
});

test.serial.skip('should import', async (t) => {});

test.serial.skip('should cleanup', async (t) => {
  await t.context.dataset.after();
  const query = `SELECT * FROM ${t.context.dataset.table}`;
  await t.throwsAsync(() => t.context.connection.query(query));
});
