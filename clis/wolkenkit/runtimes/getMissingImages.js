'use strict';

const docker = require('../docker'),
      getImages = require('./getImages');

const getMissingImages = async function ({ configuration, forVersion }) {
  if (!configuration) {
    throw new Error('Configuration is missing.');
  }
  if (!forVersion) {
    throw new Error('Version is missing.');
  }

  const missingImages = [];
  const images = await getImages({ forVersion });

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    const { name, version } = image;
    const isInstalled = await docker.isImageInstalled({ configuration, name, version });

    if (isInstalled) {
      continue;
    }

    missingImages.push(image);
  }

  return missingImages;
};

module.exports = getMissingImages;
