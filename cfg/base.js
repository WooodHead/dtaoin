'use strict';

let path = require('path');
let port = 8000;
let srcPath = path.join(__dirname, '/../src');
let publicPath = '/dist/';
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: port,
  debug: true,
  output: {
    path: path.join(__dirname, '/../dist'),
    filename: 'app.js',
    publicPath: publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: port,
    publicPath: publicPath,
    noInfo: false
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ],
    alias: {
      actions: srcPath + '/actions/',
      components: srcPath + '/components/',
      containers: srcPath + '/containers/',
      middleware: srcPath + '/middleware/',
      stores: srcPath + '/stores/',
      styles: srcPath + '/styles/',
      config: srcPath + '/config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {
    preLoaders: [{
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader'
      }],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=81920'
      }
    ]
  },
  postcss: function () {
    return [];
  }
};
