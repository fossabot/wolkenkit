'use strict';

const kebabCase = require('lodash/kebabCase'),
      mapKeys = require('lodash/mapKeys'),
      requireDir = require('require-dir');

const subCommands = mapKeys(
  requireDir(__dirname),
  (value, key) => kebabCase(key)
);

module.exports = {
  aliases: [ 'inf' ],
  description: 'Manage the infrastructure lifecycle.',
  subCommands
};
