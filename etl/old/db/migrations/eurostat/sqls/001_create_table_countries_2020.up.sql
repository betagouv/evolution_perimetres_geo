CREATE TABLE IF NOT EXISTS eurostat.countries_2020 (
  id SERIAL PRIMARY KEY,
  insee_cog varchar,
  name varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX countries_2020_id_index ON eurostat.countries_2020 USING btree (id);