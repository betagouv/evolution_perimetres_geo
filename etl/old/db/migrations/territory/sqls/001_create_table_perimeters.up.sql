CREATE TABLE IF NOT EXISTS territory.perimeters
(
  id serial primary key,
  millesime integer NOT NULL,
  com varchar(5) NOT NULL,
  l_com varchar NOT NULL,
  arr varchar(5) NOT NULL,
  l_arr varchar NOT NULL,
  epci varchar(9) NOT NULL,
  l_epci varchar NOT NULL,
  dep varchar(3) NOT NULL,
  l_dep varchar NOT NULL,
  reg varchar(2) NOT NULL,
  l_reg varchar NOT NULL,
  aom varchar(9) NOT NULL,
  l_aom varchar NOT NULL,
  country varchar(5) NOT NULL,
  l_country varchar NOT NULL,
  population integer,
  surface float(4),
  centroid geometry(POINT,2154),
  geom geometry(MULTIPOLYGON,2154),
  simplified_geom geometry(MULTIPOLYGON,2154)
);

CREATE INDEX perimeters_id_index ON territory.perimeters USING btree (id);
CREATE INDEX perimeters_centroid_index ON territory.perimeters USING gist (centroid);
CREATE INDEX perimeters_geom_index ON territory.perimeters USING gist (geom);
CREATE INDEX perimeters_simplified_geom_index ON territory.perimeters USING gist (simplified_geom);