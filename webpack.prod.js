const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BabelEnginePlugin = require('babel-engine-plugin');

module.exports = merge(common, {
  devtool: 'source-map',
  entry: [
    './src/client/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public',
    publicPath: 'https://sleepy-citadel-40559.herokuapp.com/',
  },
  plugins: [
    // create global constants that is accessed on the F.E.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BabelEnginePlugin({
      presets: ['env']
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
});
