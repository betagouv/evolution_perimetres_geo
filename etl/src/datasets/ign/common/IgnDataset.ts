import { AbstractDataset } from "src/common/AbstractDataset";
import { transformGeoFile } from '../../../helpers';
import {  FileTypeEnum } from '../../../interfaces';

export abstract class IgnDataset extends AbstractDataset {
  abstract readonly transformations: Map<string, [string,string, number,string?]>;
  abstract readonly transformedFileType: FileTypeEnum;
  transformedFilepaths:string[] = [];
  

  async transform():Promise<void> {
    for await(let file of this.transformations){
      const shpPath = this.filepaths.find(f=>f.indexOf(file[0]));
      if (shpPath){
        const geoFile = await transformGeoFile(shpPath,file[1][0],file[1][1],file[1][2],file[1][3]);
        this.transformedFilepaths.push(geoFile)
      }
    }
  }
}