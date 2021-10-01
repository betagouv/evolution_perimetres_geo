CREATE TABLE IF NOT EXISTS ign_ae_2019 (
  id SERIAL PRIMARY KEY,
  com varchar(5) NOT NULL,
  pop integer,
  geom geometry(MULTIPOLYGON,2154)
);
CREATE INDEX ign_ae_2019_id_index ON ign_ae_2019 USING btree (id);
CREATE INDEX ign_ae_2019_geom_index ON ign_ae_2019 USING gist (geom);