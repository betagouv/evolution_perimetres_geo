# Structure des données
Une fois le programme lancé, vous obtiendrez deux tables exploitables :
- perimeters
- com_evolution

## Table `perimeters`

La table principale :
```sql
  CREATE TABLE IF NOT EXISTS perimeters (
    id SERIAL PRIMARY KEY,
    year SMALLINT NOT NULL, -- le millésime
    centroid GEOMETRY(POINT, 4326) NOT NULL, -- le chef lieu si la géométrie est une commune, le centroid sinon. La projection est en 4326
    geom GEOMETRY(MULTIPOLYGON, 4326) NOT NULL, -- le polygone non simplifié en projection 4326
    geom_simple GEOMETRY(MULTIPOLYGON, 4326) NOT NULL, -- le polygone simplifié en projection 4326 pour un usage web par exemple
    l_arr VARCHAR(256), -- le nom de l'arrondissement
    arr VARCHAR(5), -- le code insee de l'arrondissement
    l_com VARCHAR(256), -- le nom de la commune
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
    aom VARCHAR(9), -- le code siren de l'aom
    l_reseau VARCHAR(256) -- le nom du réseau de transport
    reseau INT, -- le code du réseau de transport
    pop INT, -- la population
    surface FLOAT(4) -- la surface calculé à partir du champ geom (en km2)
  );
```
Les index sont les suivants :
  - id
  - centroid
  - geom
  - geom_simple

Une ligne par commune / arrondissement ainsi qu'une ligne par pays est crée par année.


## Table `com_evolutions`

La table de passage :
```sql
  CREATE TABLE IF NOT EXISTS com_evolution (
    year SMALLINT NOT NULL, -- le millésime
    mod SMALLINT NOT NULL, -- le code de la modification
    old_com VARCHAR(5), -- l'ancien code insee
    new_com VARCHAR(5), -- le nouveau code insee
    l_mod VARCHAR -- le nom de la modification
  );
```

Les index sont les suivants :
  - mod
  - old_com
  - new_com

Une ligne par changement est crée de la manière suivante :

TODO