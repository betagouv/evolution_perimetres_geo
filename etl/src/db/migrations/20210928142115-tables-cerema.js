'use strict';

var { createMigration } = require('../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    'cerema/001_create_table_aom_2019',
    'cerema/002_create_table_aom_2020',
    'cerema/003_create_table_aom_2021',
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;