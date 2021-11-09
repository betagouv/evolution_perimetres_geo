# Évolutions-geo - Évolutions des mailles géographiques

## Objectifs

Ce programme sert à agréger les données géographiques issues de différents producteurs de données afin d'obtenir une table postgresql de périmètres et de mailles géographiques françaises versionnées par année.

Il est actuellement utilisé par deux projets Beta.gouv :
- Le registre de preuve de covoiturage
- L'observatoire du covoiturage

## Installation
Vous pouvez utiliser npm ou yarn pour installer le paquet :
```shell
  yarn add @betagouvpdc/evolution-geo
```

Attention, le programme nécessite :
- 7zip
- une base de données postgresql >= 12 avec postgis

## Usage
L'utilisation de base du paquet se fait via un script npm :
```json
{
    "scripts": {
        "evolution-geo": "evolution-geo"
    }
}
```

Maintenant, via la ligne de commande :
```shell
  yarn evolution-geo --help
```

## Structure finale des données
Une fois le programme lancé, vous obtiendrez deux tables exploitables : 

La table principale :
```postgresql
  CREATE TABLE IF NOT EXISTS perimeters (
    id SERIAL PRIMARY KEY,
    year SMALLINT NOT NULL, -- le millésime
    centroid GEOMETRY(POINT, 4326) NOT NULL, -- le centre
    geom GEOMETRY(MULTIPOLYGON, 4326) NOT NULL, -- la forme
    geom_simple GEOMETRY(MULTIPOLYGON, 4326) NOT NULL, -- la forme simplifiée
    l_arr VARCHAR(256), -- le nom de l'arrondissement
    arr VARCHAR(5), -- le code insee de l'arrondissement
    l_com VARCHAR(256), -- le nom de la communse
    com VARCHAR(5), -- le code insee de la commune
    l_epci VARCHAR(256), -- le nom de l'epci 
    epci VARCHAR(9), -- le code insee de l'epci
    l_dep VARCHAR(256), -- le nom du département
    dep VARCHAR(3), -- le code insee du département
    l_reg VARCHAR(256), -- le nom de la région
    reg VARCHAR(2), -- le code insee de la région
    l_country VARCHAR(256), -- le nom du pays
    country VARCHAR(5), -- le code insee du pays
    l_aom VARCHAR(256), -- le nom de l'aom
    aom VARCHAR(9), -- le code insee de l'aom
    pop INT, -- la population
    surface FLOAT(4) -- la surface en km2
  );
```
Les index sont les suivants :
  - id
  - centroid
  - geom
  - geom_simple

Une ligne par commune / arrondissement ainsi qu'une ligne par pays est crée par année.

La table de passage :
```postgresql
  CREATE TABLE IF NOT EXISTS com_evolution (
    year SMALLINT NOT NULL, -- le millésime
    mod SMALLINT NOT NULL, -- le code de la modification
    old_com VARCHAR(5), -- l'ancien code insee
    new_com VARCHAR(5), -- le nouveau code insee
    l_mod VARCHAR -- le nouveau label
  );
```

Les index sont les suivants :
  - mod
  - old_com
  - new_com

Une ligne par changement est crée de la manière suivante :

TODO


## Usage avancé

