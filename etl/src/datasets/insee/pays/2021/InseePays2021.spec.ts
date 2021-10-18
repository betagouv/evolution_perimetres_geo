import anyTest, { TestInterface } from 'ava';
import { access } from 'fs/promises';
import { Pool } from 'pg';
import { MemoryStateManager } from '../../../../providers/MemoryStateManager';
import { AbstractDataset } from '../../../../common/AbstractDataset';
import { createPool, createFileProvider } from '../../../../helpers';
import { InseePays2021 as Dataset } from './InseePays2021';
import { Migrator } from '../../../../common/Migrator';
import { CreateGeoTable } from '../../../../datastructure/000_CreateGeoTable';
import { CreateComEvolutionTable } from '../../../../datastructure/001_CreateComEvolutionTable';
import { CeremaAom2019 } from '../../../cerema/aom/2019/CeremaAom2019';

interface TestContext {
  migrator: Migrator;
  connection: Pool;
  dataset: AbstractDataset;
}

const test = anyTest as TestInterface<TestContext>;

test.before(async (t) => {
  t.context.connection = createPool();
  t.context.migrator = new Migrator(t.context.connection, createFileProvider(), {
    targetSchema: 'public',
    migrations: new Set([CreateGeoTable, CreateComEvolutionTable, Dataset, CeremaAom2019]),
  });
  t.context.dataset = new Dataset(t.context.connection, createFileProvider());
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
    `);
  await t.context.connection.query(`
      DROP TABLE IF EXISTS public.dataset_migration
    `);
  await t.context.migrator.prepare();
});

test.after.always(async (t) => {
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
    `);
  await t.context.connection.query(`
      DROP TABLE IF EXISTS public.dataset_migration
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
  await t.context.migrator.run([CreateGeoTable, CreateComEvolutionTable, Dataset, CeremaAom2019]);
  const response = await t.context.connection.query(`
      SELECT count(distinct country) FROM public.perimeters
    `);
  t.is(response.rows[0].count, '282');
});

test.serial('should cleanup', async (t) => {
  await t.context.dataset.after();
  const query = `SELECT * FROM ${t.context.dataset.tableWithSchema}`;
  await t.throwsAsync(() => t.context.connection.query(query));
});
