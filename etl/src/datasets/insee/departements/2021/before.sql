CREATE TABLE IF NOT EXISTS insee_dep_2021 (
  id SERIAL PRIMARY KEY,
  dep varchar(3) NOT NULL,
  reg varchar(2),
  chef_lieu varchar(5),
  tncc varchar,
  ncc varchar,
  nccenr varchar,
  libelle varchar
);
CREATE INDEX insee_dep_2021_id_index ON insee_dep_2021 USING btree (id);