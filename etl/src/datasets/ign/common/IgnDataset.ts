import { stringify } from "querystring";
import { AbstractDataset } from "src/common/AbstractDataset";
import { transformGeoFile } from '../../../helpers';
import {  FileTypeEnum } from '../../../interfaces';

export abstract class IgnDataset extends AbstractDataset {
  abstract readonly transformations: Map<string, [string,string,number,boolean,string?]>;
  abstract readonly transformedFileType: FileTypeEnum;
  transformedFilepaths:string[] = [];
  

  async transform():Promise<void> {
    for await(let file of this.transformations){
      let path:string | undefined;
      if(file[0][3]){
        path = this.transformedFilepaths.find(f=>f.indexOf(file[0]));
      } else {
        path = this.filepaths.find(f=>f.indexOf(file[0]));
      }
      if (path){
        const geoFile = await transformGeoFile(path,file[1][0],file[1][1],file[1][2],file[1][3],file[1][4]);
        if(!file[0][3]){
          this.transformedFilepaths.push(geoFile)
        }
      }
    }
  }
}