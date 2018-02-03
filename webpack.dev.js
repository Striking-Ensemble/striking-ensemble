const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'eval',
  output: {
    publicPath: '/',
  },
  devServer: {
    port: 3000,
    inline: true,
    historyApiFallback: true
  }
});
