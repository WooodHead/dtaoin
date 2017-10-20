'use strict';

let path = require('path');
let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let baseConfig = require('./base');
//css单独打包
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function() {
  return webpackMerge(baseConfig(), {
    entry: {
      // main: path.join(__dirname, '../src/index'),
      main: [path.join(__dirname, '../src/index')],
    },
    output: {
      path: path.join(__dirname, './assets/'),
      publicPath: '/assets/',
      filename: '[name].bundle.js',
    },

    devServer: {
      contentBase: './',
      historyApiFallback: true,
      publicPath: '/assets/',
      hot: true,
      hotOnly: true,
      noInfo: false,
      port: '9999',
      quiet: true, //控制台中不输出打包的信息
      inline: true,
      lazy: false,
      stats: 'minimal',
      disableHostCheck: true,
      watchOptions: {
        aggregateTimeout: 300,
      },
    },
    cache: true,
    devtool: 'eval',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"dev"', // process.env.NODE_ENV 不加双引号则会返回dev变量
      }),
      new ExtractTextPlugin('styles.css'),
      new webpack.HotModuleReplacementPlugin(),
    ],
  });

};

