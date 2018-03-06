const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg', '.gif'] // auto resolve file extensions when importing
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/, //exclude any and all files in the node_modules folder
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              useRelativePath: process.env.NODE_ENV === "production"
            }
          }
        ]
      }
    ]
  }
};
