import { inseeDownload } from './downloads/insee'


async function main(){
  try{
    inseeDownload()
    console.log("All done")
    process.exit()  
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}

main()