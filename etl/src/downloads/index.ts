import {inseeDownload} from './insee'
import {ceremaDownload} from './cerema'
import {eurostatDownload} from './eurostat'
import {ignDownload} from './ign'

export async function downloads():Promise<void>{
  try{
    await inseeDownload() 
    await ceremaDownload()
    await eurostatDownload()
    await ignDownload()
    console.log("All downloads done") 
    process.exit()
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}
downloads()