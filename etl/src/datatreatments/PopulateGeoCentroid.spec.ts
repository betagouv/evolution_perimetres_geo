import anyTest, { TestFn } from 'ava';
import { Pool } from 'pg';
import { MemoryStateManager } from '../providers/MemoryStateManager';
import { AbstractDatatreatment } from '../common/AbstractDatatreatment';
import { createPool, createFileManager } from '../helpers';
import { PopulateGeoCentroid as Dataset } from './PopulateGeoCentroid';

interface TestContext {
  connection: Pool;
  dataset: AbstractDatatreatment;
}

const test = anyTest as TestFn<TestContext>;

test.before(async (t) => {
  t.context.connection = createPool();
  t.context.dataset = new Dataset(t.context.connection, createFileManager());
});

test.serial('should validate', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.validate(new MemoryStateManager()));
});

test.serial('should after', async (t) => {
  await t.context.dataset.after();
  const count = await t.context.connection.query(`SELECT count(*) FROM ${t.context.dataset.tableWithSchema}`);
  t.not(count.rows[0].count, '0');
});
