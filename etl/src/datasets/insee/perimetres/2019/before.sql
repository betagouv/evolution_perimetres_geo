CREATE TABLE IF NOT EXISTS insee_perim_2019 (
  id SERIAL PRIMARY KEY,
  codgeo varchar(5) NOT NULL UNIQUE,
  libgeo varchar,
  epci varchar(9),
  libepci varchar,
  dep varchar(3),
  reg varchar(2)
);

CREATE INDEX perim_2019_id_index ON insee_perim_2019 USING btree (id);