const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
	devtool: 'source-map',
	entry: [
		'./src/client/index.js'
	],
	output: {
		path: __dirname + '/public',
		publicPath: '/public/',
		filename: 'bundle.js'
	},
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
	},
	devServer: {
		port: 3000,
		inline: true,
		historyApiFallback: true
	}
};