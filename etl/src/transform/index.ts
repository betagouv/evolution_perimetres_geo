import {ignTransform} from './ign'

export async function transform():Promise<void>{
  try{

    await ignTransform()
    console.log("All transformations done") 
    process.exit()
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}
transform()