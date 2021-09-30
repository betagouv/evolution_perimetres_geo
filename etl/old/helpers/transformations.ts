import fs from 'fs'
import mapshaper from 'mapshaper'
import ora from 'ora'

export const convertGeoFile = async function(path:string,filename: string,outPath: string,outFilename: string,format: string,precision: number,simplify?:string,force?:boolean):Promise<void>{ 
  const spinner = ora()
  try{
    if(fs.existsSync(outPath+'/'+outFilename) && filename !== outFilename){
      spinner.succeed(filename+' already transformed')
    } else {
      spinner.start('Simplify file '+filename)
      if(simplify === undefined){
        await mapshaper.runCommands('-i '+path+filename+' -o '+outPath+outFilename+' format='+format+' precision='+precision)
      }else{
        if (force){
          await mapshaper.runCommands('-i '+path+filename+' '+simplify+' -o force '+outPath+outFilename+' format='+format+' precision='+precision)
        } else {
          await mapshaper.runCommands('-i '+path+filename+' '+simplify+' -o '+outPath+outFilename+' format='+format+' precision='+precision)
        }
      }
      spinner.succeed(filename+' transformed')
    }
  }
  catch(err){
    spinner.fail('Error during transforming file '+filename)
    console.log(err)
  }
}