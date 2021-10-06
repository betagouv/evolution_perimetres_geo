import { getTemporaryFilePath } from '.';
import mapshaper from 'mapshaper';

export async function transformGeoFile(filepath: string,name:string, format: string,precision: number,simplify?:string):Promise<string>{ 
  try{
    const outFilepath = `${getTemporaryFilePath()}/${name}.${format}`;
    if(simplify){
      await mapshaper.runCommands(`-i ${filepath} ${simplify} -o ${outFilepath} format=${format} precision=${precision}`);
    }else{
      await mapshaper.runCommands(`-i ${filepath} -o ${outFilepath} format=${format} precision=${precision}`);
    }
    return outFilepath;
  }
  catch(err){
    console.error(err);
    throw err;
  }
}