import fs from 'fs'
import { join } from 'path'
import {downloadFile} from '../helpers/downloads'

export async function eurostatDownload():Promise<void>{
  try{
    console.log('Start download Eurostat files')
    const path =join(__dirname, '../../assets/eurostat/')
    if (!fs.existsSync(path)){
      fs.mkdirSync('./assets/eurostat', { recursive: true });
    }
    await downloadFile(path,'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson','countries_2020.geojson')

  } 
  catch(err){
    console.log(err)
  }
}