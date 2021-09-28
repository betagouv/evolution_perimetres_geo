'use strict';

var { createMigration } = require('../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    'ign/001_create_table_chefs_lieux_2019',
    'ign/002_create_table_chefs_lieux_2020',
    'ign/003_create_table_chefs_lieux_2021'
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;