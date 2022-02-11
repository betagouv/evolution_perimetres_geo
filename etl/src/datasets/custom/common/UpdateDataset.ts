import { AbstractDataset } from '../../../common/AbstractDataset';
import { SqlError } from '../../../errors';
import { FileTypeEnum, ArchiveFileTypeEnum } from '../../../interfaces';

export enum OperationEnum {
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
}

export interface TransformationInterface {
  op: OperationEnum,
  values: {},
  geometries?:{},
}

export abstract class UpdateDataset extends AbstractDataset {

  fileType: FileTypeEnum = FileTypeEnum.None;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map();
  readonly url: string = '';

  abstract readonly transformations: Array<TransformationInterface>;

  async before(): Promise<void> {}

  async download(): Promise<void> {}

  async transform(): Promise<void> {}

  async load(): Promise<void> {}

  async import(): Promise<void> {
    try{
      let query = '';
      for await (const {op, values, geometries} of this.transformations) {
        if(op === OperationEnum.Insert){
          query = `INSERT INTO ${this.targetTableWithSchema}(
            ${Object.keys(values).join(',\n')}
            ${geometries ? `,${Object.keys(geometries).join(',\n')}` : ''}
          )
          SELECT * FROM (VALUES(${Object.values(values).join(',\n')})) as t
          ${geometries ? `,${Object.values(geometries).join(',\n')}` : ''}
          ;`;
        } else if (op === OperationEnum.Update){
          query = `UPDATE ${this.targetTableWithSchema} SET (
            ${Object.keys(values).join(',\n')}
            ${geometries ? `,${Object.values(geometries).join(',\n')}` : ''}
          )
          SELECT * FROM (VALUES(${Object.values(values).join(',\n')})) as t
          ${geometries ? `,${Object.values(geometries).join(',\n')}` : ''}
          ;`;
        } else if (op === OperationEnum.Delete){
          const conditions:Array<string> = []
          Object.entries(values).forEach(([k,v])=>{conditions.push(`${k} = ${v}`)})
          query = `DELETE FROM  ${this.targetTableWithSchema}
          WHERE ${Object.values(conditions).join('\nAND\n')};`
        }
        await this.connection.query(query);
      }
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }

  async after(): Promise<void> {}

}