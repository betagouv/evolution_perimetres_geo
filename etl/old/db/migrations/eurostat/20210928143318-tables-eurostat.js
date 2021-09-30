'use strict';

var { createMigration } = require('../../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    '001_create_table_countries_2020'
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;