import { getDatasetUuid } from "../helpers";
import { StaticAbstractDataset } from "../interfaces";
import { Pool } from "pg";

export class Migrator {
    constructor(
        protected connection: Pool
    ) {}

    async install(): Promise<void> {
        await this.connection.query(`
            CREATE TABLE IF NOT EXISTS dataset_migration (
                datetime timestamp NOT NULL DEFAULT NOW(),
                dataset varchar(128) NOT NULL,
                year smallint NOT NULL,
                PRIMARY KEY (dataset, year)
            )
        `);
    }

    async get(): Promise<Set<string>> {
        const result = await this.connection.query(`
          SELECT dataset, year FROM dataset_migration
        `);

       return new Set(...result.rows.map(row => getDatasetUuid(row.dataset, row.year)));
    }

    async set(dataset: StaticAbstractDataset): Promise<void> {
        await this.connection.query({
            text: `
              INSERT INTO dataset_migration (dataset, year) VALUES (?, ?)
              ON CONFLICT DO NOTHING
            `,
            values: [dataset.dataset, dataset.year]
        });
    }
}

