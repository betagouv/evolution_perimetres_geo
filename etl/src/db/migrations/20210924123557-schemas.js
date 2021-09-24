'use strict';

var { createMigration } = require('../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    'territory/000_create_schema_territory',
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;