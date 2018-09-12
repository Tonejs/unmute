const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const commonConfig = {
	mode : 'development',
	context : __dirname,
	resolve : {
		modules : [
			'node_modules',
			path.resolve(__dirname, '.'),
		],
		/*alias : {
			Tone : 'node_modules/tone/Tone'
		},*/
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
				loader : 'raw-loader'
			}
		]
	},
	devtool : 'source-map'
}

const libConfig = Object.assign({}, commonConfig, {
	entry : {
		unmute : './src/Unmute.js'
	},
	output : {
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
		library : 'UnmuteButton',
		libraryTarget : 'umd',
		libraryExport : 'UnmuteButton'
	},	
})

const testConfig = Object.assign({}, commonConfig, {
	entry : {
		test : './test/build-test.js'
	},
	output : {
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
	},
	plugins : [
		new HtmlWebpackPlugin()
	]
})

module.exports = env => {
	if (env && env.test){
		return testConfig
	} else {
		return libConfig
	}
}
