import { join } from 'path'
import { downloadFile } from './index'


export async function ceremaDownload(){
  const path =join(__dirname, '../../assets/cerema/')
  await Promise.all([
    downloadFile(path,'http://www.cerema.fr/system/files/documents/2019/07/base_rt_2019_-_v1-1_-_version_diffusable_0.ods','aom_2019.ods'),
    downloadFile(path,'https://www.cerema.fr/system/files/documents/2020/07/base_rt_2020_v1-1_diffusion_0.ods','aom_2020.ods'),
    downloadFile(path,'https://www.cerema.fr/system/files/documents/2021/06/base_rt_2021_v4_diffusion.xlsx','aom_2021.xlsx')
  ])
}