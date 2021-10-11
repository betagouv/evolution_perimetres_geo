CREATE TABLE IF NOT EXISTS ign_ae_2020 (
  id SERIAL PRIMARY KEY,
  com varchar(5) NOT NULL,
  pop integer,
  geom geometry(MULTIPOLYGON,2154),
  centroid GEOMETRY(POINT, 2154),
  geom_simple GEOMETRY(MULTIPOLYGON, 2154)
);
CREATE INDEX ign_ae_2020_id_index ON ign_ae_2020 USING btree (id);
CREATE INDEX ign_ae_2020_geom_index ON ign_ae_2020 USING gist (geom);
CREATE INDEX ign_ae_2020_centroid_index ON ign_ae_2020 USING gist (centroid);
CREATE INDEX ign_ae_2020_geom_simple_index ON ign_ae_2020 USING gist (geom_simple);