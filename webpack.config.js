const path = require('path')

module.exports = {
	mode : 'development',
	entry : {
		unmute : ['./src/Unmute.js'],
	},
	context : __dirname,
	output : {
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
		library : 'UnmuteButton',
		libraryTarget : 'umd',
		libraryExport : 'UnmuteButton'
	},
	resolve : {
		modules : [
			'node_modules',
			path.resolve(__dirname, '.')
		],
	},
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
				loader : 'url-loader'
			}
		]
	},
	devtool : 'source-map'
}
