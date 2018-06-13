const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode : 'development',
	entry : {
		'mute-button' : ['./src/MuteButton.js'],
	},
	context : __dirname,
	output : {
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
		library : 'MuteButton',
		libraryTarget : 'umd',
		libraryExport : 'MuteButton'
	},
	resolve : {
		modules : [
			'node_modules',
			path.resolve(__dirname, '.')
		],
	},
	plugins : [
		new HtmlWebpackPlugin({
			title : 'Mute Button',
			chunks : ['mute-button'],
			filename : 'index.html'
		}),
	],
	module : {
		rules : [
			{ 
				test : /\.js$/, 
				exclude : /node_modules/, 
				loader : 'babel-loader' 
			},
			{ 
				test : /\.scss$/, 
				loader : 'style-loader!css-loader!sass-loader' 
			},
			{
				test : /\.(svg)$/,
				loader : 'raw-loader'
			}
		]
	},
	devtool : 'source-map'
}
