const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'] // auto resolve file extensions when importing
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/, //exclude any and all files in the node_modules folder
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
