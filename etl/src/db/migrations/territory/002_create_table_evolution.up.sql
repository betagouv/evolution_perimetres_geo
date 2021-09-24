CREATE TABLE IF NOT EXISTS territory.evolution
(
  id serial primary key,
  millesime integer NOT NULL,
  old_insee varchar(5) NOT NULL,
  new_insee varchar(5) NOT NULL
);

CREATE INDEX evolution_id_index ON territory.evolution USING btree (id);