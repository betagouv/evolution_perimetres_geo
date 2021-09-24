import { join } from 'path'
import { downloadFile } from './index'


export async function ignDownload(){
  let path =join(__dirname, '../../assets/ign/')
  await Promise.all([
    downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-0__SHP__FRA_WGS84G_2019-09-24.7z','admin-express-2019.7z'),
    downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-1__SHP__FRA_WGS84G_2020-11-20.7z','admin-express-2020.7z')
  ])
}