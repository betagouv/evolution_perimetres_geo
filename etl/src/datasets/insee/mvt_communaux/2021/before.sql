CREATE TABLE IF NOT EXISTS insee_mvtcom_2021 (
  id SERIAL PRIMARY KEY,
  mod int2 NOT NULL,
  date_eff varchar,
  typecom_av varchar,
  com_av varchar,
  tncc_av varchar,
  ncc_av varchar,
  nccenr_av varchar,
  libelle_av varchar,
  typecom_ap varchar,
  com_ap varchar,
  tncc_ap varchar,
  ncc_ap varchar,
  nccenr_ap varchar,
  libelle_ap varchar
);
CREATE INDEX insee_mvtcom_2021_id_index ON insee_mvtcom_2021 USING btree (id);