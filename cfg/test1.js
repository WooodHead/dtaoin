'use strict';

let path = require('path');
let webpack = require('webpack');
let _ = require('lodash');

let baseConfig = require('./base');

let config = _.merge({
  entry: [
    './src/index'
  ],
  cache: true,
  devtool: 'sourcemap',
}, baseConfig);

// Add needed loaders
config.module.loaders.push({
  test: /\.jsx?$/,
  loader: 'react-hot!babel-loader',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src')]
  )
});

module.exports = config;
