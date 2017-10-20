'use strict';

let webpack = require('webpack');
//css单独打包
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
//css压缩
// let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let path = require('path');
let port = 8000;
let srcPath = path.join(__dirname, '/../src');

module.exports = function() {

  return {
    entry: {
      vendor: [
        'moment',
        'react',
        'react-router',
        'react-dom',
        'redux',
        'react-redux',
        'react-router-redux',
        'redux-thunk',
        'react-color',
      ],
    },
    resolve: {
      extensions: [
        '.js',
        '.jsx',
      ],
      alias: {
        actions: srcPath + '/actions/',
        components: srcPath + '/components/',
        containers: srcPath + '/containers/',
        middleware: srcPath + '/middleware/',
        stores: srcPath + '/stores/',
        styles: srcPath + '/styles/',
        config: srcPath + '/config/' + process.env.REACT_WEBPACK_ENV,
      },
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: srcPath,
          use: [
            {
              loader: 'eslint-loader',
            }, {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'stage-0', 'react'],
                plugins: [
                  [
                    'import', {
                    'libraryName': 'antd',
                    'style': 'css',
                  },
                  ]],
              },
            }],
        }, {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
          // use: ExtractTextPlugin.extract({use: ['css-loader']}),
        }, {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'less-loader',
          ],
          // use: ExtractTextPlugin.extract({use: ['css-loader', 'less-loader']})
        }, {
          test: /\.(png|jpg|gif|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader?limit=50000',
            }],
        }],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        port: port,
        debug: true,
        postcss: function() {
          return [];
        },
        eslint: {
          // 自动修复一些格式问题
          fix: true,
        },
      }),
      // new OptimizeCssAssetsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
      }),
    ],
  };
};
