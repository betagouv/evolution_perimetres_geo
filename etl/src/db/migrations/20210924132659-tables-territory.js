'use strict';

var { createMigration } = require('../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    'territory/001_create_table_perimeters',
    'territory/002_create_table_evolution',
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;