'use strict';

const path = require('path');

const isolated = require('isolated');

const shell = require('../shell');

const getExistingVersions = async function () {
  const cwd = await isolated();

  await shell.execLive(`git clone git@github.com:thenativeweb/wolkenkit-documentation.git`, { cwd, silent: true });
  await shell.execLive(`git clone git@github.com:thenativeweb/wolkenkit-client-js.git`, { cwd, silent: true });

  /* eslint-disable global-require */
  const [ , wolkenkit ] = require(path.join(cwd, 'wolkenkit-documentation', 'lib', 'docs', 'versions-autogenerated.json'));
  const existingVersions = require(path.join(cwd, 'wolkenkit-documentation', 'lib', 'docs', 'latest', 'versions-autogenerated.json'));
  const browserVersions = require(path.join(cwd, 'wolkenkit-client-js', 'test', 'browser', 'browser-versions.json'));
  /* eslint-enable global-require */

  if (existingVersions.wolkenkit) {
    throw new Error('Unexpected property wolkenkit.');
  }

  existingVersions.wolkenkit = wolkenkit;

  for (const [ browser, version ] of Object.entries(browserVersions)) {
    existingVersions[browser] = version;
  }

  return existingVersions;
};

module.exports = getExistingVersions;
