import { join } from 'path'
import {convertGeoFile} from '../helpers/transformations'

export async function ignTransform():Promise<void>{
  try{
    console.log('Start transform IGN files')
    const path2019 =join(__dirname, '../../assets/ign/ADMIN-EXPRESS-COG_2-0__SHP__FRA_2019-09-24/ADMIN-EXPRESS-COG/1_DONNEES_LIVRAISON_2019-09-24/ADE-COG_2-0_SHP_WGS84_FR/')
    const path2020 =join(__dirname, '../../assets/ign/ADMIN-EXPRESS-COG_2-1__SHP__FRA_2020-11-20/ADMIN-EXPRESS-COG/1_DONNEES_LIVRAISON_2020-11-20/ADE-COG_2-1_SHP_WGS84G_FRA/')
    // simplification des géométries et transformation en geojson
    await Promise.all([
      convertGeoFile(path2019,'COMMUNE_CARTO.shp',join(__dirname, '../../assets/ign/'),'communes_2019.geojson','geojson',0.000001,'-simplify dp interval=100 keep-shapes'),
      convertGeoFile(path2019,'CHEF_LIEU_CARTO.shp',join(__dirname, '../../assets/ign/'),'chefs_lieux_2019.geojson','geojson',0.000001),
      convertGeoFile(path2020,'COMMUNE.shp',join(__dirname, '../../assets/ign/'),'communes_2020.geojson','geojson',0.000001,' '+path2020+'ARRONDISSEMENT_MUNICIPAL.shp combine-files -merge-layers force -simplify 60%'),
      convertGeoFile(path2020,'CHEF_LIEU_CARTO.shp',join(__dirname, '../../assets/ign/'),'chefs_lieux_2020.geojson','geojson',0.000001,' '+path2020+'CHFLIEU_ARRONDISSEMENT_MUNICIPAL.shp combine-files -merge-layers force')
    ])
    // 2 simplifications supplémentaires pour la couche communes_2020
    await convertGeoFile(join(__dirname, '../../assets/ign/'),'communes_2020.geojson',join(__dirname, '../../assets/ign/'),'communes_2020.geojson','geojson',0.000001,'-simplify 50% keep-shapes',true)
    await convertGeoFile(join(__dirname, '../../assets/ign/'),'communes_2020.geojson',join(__dirname, '../../assets/ign/'),'communes_2020.geojson','geojson',0.000001,'-simplify 40% keep-shapes',true)
  } 
  catch(err){
    console.log(err)
  }
}