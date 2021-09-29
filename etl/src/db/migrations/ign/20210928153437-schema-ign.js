'use strict';

var { createMigration } = require('../../helpers/createMigration');
var { setup, up, down } = createMigration(
  [
    '000_create_schema_ign'
  ],
  __dirname,
);

exports.setup = setup;
exports.up = up;
exports.down = down;