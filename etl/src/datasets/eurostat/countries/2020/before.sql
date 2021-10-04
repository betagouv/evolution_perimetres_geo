CREATE TABLE IF NOT EXISTS eurostat_countries_2020 (
  id SERIAL PRIMARY KEY,
  codeiso3 varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX eurostat_countries_2020_id_index ON eurostat_countries_2020 USING btree (id);
CREATE INDEX eurostat_countries_2020_geom_index ON eurostat_countries_2020 USING gist (geom);