const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'eval',
  devServer: {
    port: 3000,
    inline: true,
    historyApiFallback: true
  }
});
