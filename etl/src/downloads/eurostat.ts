import { join } from 'path'
import { downloadFile } from './index'


export async function eurostatDownload(){
  let path = join(__dirname, '../../assets/eurostat/') 
  await downloadFile(path,'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson','countries_2020.geojson')

}