import { UpdateDataset, TransformationInterface, OperationEnum } from './common/UpdateDataset';

export class Perim2022 extends UpdateDataset {
  static producer = 'rpc';
  static dataset = 'perim';
  static year = 2022;
  static table = 'rpc_perim_2022';

  readonly transformations: Array<TransformationInterface> = [
    
    { 
      op:OperationEnum.Delete, 
      values:{
        year:2022,
        arr:`'test'`,
      }
    }
  ];
}