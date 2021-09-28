CREATE TABLE IF NOT EXISTS ign.chefs_lieux_2019 (
  id SERIAL PRIMARY KEY,
  com varchar(5) NOT NULL UNIQUE,
  l_com varchar,
  statut varchar,
  geom geometry(POINT,4326)
);
CREATE INDEX chefs_lieux_2019_id_index ON ign.chefs_lieux_2019 USING btree (id);
CREATE INDEX chefs_lieux_2019_geom_index ON ign.chefs_lieux_2019 USING gist (geom);