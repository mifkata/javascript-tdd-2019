const path = require('path');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  dist: path.resolve(ROOT, 'dist'),
  screenshots: path.resolve(ROOT, 'screenshots'),
};
