const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    publicPath: 'https://sleepy-citadel-40559.herokuapp.com/',
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
});
