import { UpdateDataset, TransformationInterface, OperationEnum } from './common/UpdateDataset';

export class Perim2022 extends UpdateDataset {
  static producer = 'rpc';
  static dataset = 'perim';
  static year = 2022;
  static table = 'rpc_perim_2022';

  readonly transformations: Array<TransformationInterface> = [
    { 
      op:OperationEnum.Insert, 
      values:{
        year:2022,
        arr:`'test'`,
      }, 
      geometries:{
        geom:`(SELECT geom from perimeters WHERE year = 2021 AND arr = '38240') as t1`,
        geom_simple:`(SELECT geom_simple from perimeters WHERE year = 2021 AND arr = '38240') as t2`,
        centroid:`(SELECT centroid from perimeters WHERE year = 2021 AND arr = '38240') as t3`,
      }
    }
  ];
}