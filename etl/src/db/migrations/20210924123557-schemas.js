'use strict';

var { createMigration } = require('../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    'territory/000_create_schema_territory',
    'insee/000_create_schema_insee',
    'ign/000_create_schema_ign',
    'cerema/000_create_schema_cerema',
    'eurostat/000_create_schema_eurostat'
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;