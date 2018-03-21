const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch', 
    'webpack-hot-middleware/client', 
    './src/client/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // skip the emitting phase whenever there are errors while compiling
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
