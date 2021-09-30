import {ignImport} from './ign'

export async function load():Promise<void>{
  try{
    await ignImport()
    console.log("All Importations done") 
    process.exit()
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}
load()