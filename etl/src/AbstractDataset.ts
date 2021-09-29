export interface StaticAbstractDataset {
    readonly uuid: string;
    constructor(
        connection
    ): AbstractDataset;
}

export interface DatasetInterface {
    validate(datasets: Set<string>): Promise<void>;
    before(): Promise<void>;
    download(): Promise<void>;
    transform(): Promise<void>;
    load(): Promise<void>;
    import(): Promise<void>;
    after(): Promise<void>;
}

export abstract class AbstractDataset implements DatasetInterface {
    protected abstract beforeSql: string;
    protected abstract downloadUrl: string;

    async before() {
        this.connection.query(fs.load(this.beforeSql));
    }

    async download() {
        this.downloadUrl
    }


}

class Cerema2020 extends AbstractDataset {
    static uuid = '2020-cerema';
    beforeSql: __dirname

    async download()
}

export class Cerema2020 extends AbstractCeremaDataset {
    async before() {
        this.connection.query(`
        CREATE TABLE ...
        
        `);
    }

    async download() {

    }


}

/*
main.ts
|
---- Cerema
       |
       2020.ts

*/

