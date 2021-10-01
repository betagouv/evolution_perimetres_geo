CREATE TABLE IF NOT EXISTS insee_reg_2021 (
  id SERIAL PRIMARY KEY,
  reg varchar(2) NOT NULL,
  chef_lieu varchar(5),
  tncc varchar,
  ncc varchar,
  nccenr varchar,
  libelle varchar
);
CREATE INDEX insee_reg_2021_id_index ON insee_reg_2021 USING btree (id);