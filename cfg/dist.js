'use strict';

let path = require('path');
let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
//css单独打包
const ExtractTextPlugin = require('extract-text-webpack-plugin');
let baseConfig = require('./base');
let PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const configuration = {};
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function() {
  return webpackMerge(baseConfig(), {
    entry: {
      main: path.join(__dirname, '../src/index'),
    },
    output: {
      path: path.join(__dirname, '/../dist'),
      publicPath: '/dist/',
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
    },
    cache: false,
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new ExtractTextPlugin('styles.[chunkhash].css'),
      new PrepackWebpackPlugin(configuration),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true,
        },
        compress: {
          screw_ie8: true,
          warnings: false,
          drop_debugger: true,
          drop_console: true,
        },
        comments: false,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        favicon: './favicon.ico',
        chunksSortMode: 'dependency',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
        hash: false,
      }),
    ],
  });
};
