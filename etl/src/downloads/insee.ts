import fs from 'fs'
import { join } from 'path'
import { downloadFile } from './index'


export async function inseeDownload(){
  const path =join(__dirname, '../../assets/insee')
  if (!fs.existsSync(path)){
    fs.mkdirSync('./assets/insee', { recursive: true });
  }
  await Promise.all([
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/commune2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/mvtcommune2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2019.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2020_v1.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2021.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/departement2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/region2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/pays2021-csv.zip'),
  ])
}