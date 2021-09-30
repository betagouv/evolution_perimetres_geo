import fs from 'fs'
import { join } from 'path'
import {downloadFile} from '../helpers/downloads'

export async function ignDownload():Promise<void>{
  try{
    console.log('Start download IGN files')
    const path =join(__dirname, '../../assets/ign/')
    if (!fs.existsSync(path)){
      fs.mkdirSync('./assets/ign', { recursive: true });
    }
    await Promise.all([
      downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-0__SHP__FRA_L93_2019-09-24.7z','admin-express-2019.7z'),
      downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-1__SHP__FRA_L93_2020-11-20.7z','admin-express-2020.7z'),
      downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_3-0__SHP__FRA_L93_2021-05-19.7z','admin-express-2021.7z'), 
    ])
  } 
  catch(err){
    console.log(err)
  }
}