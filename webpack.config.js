var fs = require('fs');
var path = require('path');

var webpack = require('webpack');

//plugins
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AutoPrefixerPlugin = require('autoprefixer-core');
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
var json = require("json-loader");
var VendorChunkPlugin = require('webpack-vendor-chunk-plugin');

//Environment detection
var node_env = process.env.NODE_ENV || 'development';

//dev server configuration
var publicPath = process.env.PUBLIC_PATH || 'http://localhost:2992/static/';

//Project root
var context = path.join(__dirname, '.');

//Assets location
var rootAssetPath = './pvlogweb/assets';
var contextRoot = path.join(context, rootAssetPath);

//supported languages
var languages = /en|de/;

//build output location
var buildOutputPath = './static';

//Assets configuration
var assets = {
	fonts: {
		path: 'fonts',
		filename: '[path][name].[hash].[ext]'
	},
	images: {
		path: 'images',
		filename: '[path][name].[hash].[ext]'
	 },
	scripts: {
		path: 'js',
		//filename: '[name].[chunkhash].js',
		//chunkFilename: '[id].[chunkhash].js'
		filename: '[name].js',
		chunkFilename: '[id].js'
	},
	styles: {
		path: 'css',
		//filename: '[name].[chunkhash].css'
		//filename: '[name].[chunkhash].css'
		filename: '[name].css',
		filename: '[name].css'
	}
};

var common = [
	path.join(contextRoot, assets.styles.path, 'dashboard.css'),
	path.join(contextRoot, assets.styles.path, 'ie10-viewport-bug-workaround.css'),
	path.join(contextRoot, assets.scripts.path, 'sb-admin-2.js'),
	path.join(contextRoot, assets.styles.path, 'util.css')
];

var vendor_common = [
	'jquery/dist/jquery.js',
	'bootstrap/dist/css/bootstrap.css',
	'font-awesome/css/font-awesome.css',
	'bootstrap/dist/js/bootstrap.js',
	'bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
];


//Different resource chunks
var chunks = {
		day_chart : [
			path.join(contextRoot, assets.scripts.path, 'day-chart-page.js'),
		].concat(common).concat(vendor_common),
		month_chart : [
			path.join(contextRoot, assets.scripts.path, 'month-chart-page.js'),
		].concat(common).concat(vendor_common),
		year_chart : [
			path.join(contextRoot, assets.scripts.path, 'year-chart-page.js')
		].concat(common).concat(vendor_common),
		total_chart : [
			path.join(contextRoot, assets.scripts.path, 'total-chart-page.js')
		].concat(common).concat(vendor_common),
		event : [
			path.join(contextRoot, assets.scripts.path, 'events-page.js')
		].concat(common).concat(vendor_common),
		about : [
			path.join(contextRoot, assets.scripts.path, 'about-page.js')
		].concat(common).concat(vendor_common),
		overview : [
			path.join(contextRoot, assets.scripts.path, 'overview-page.js')
		].concat(common).concat(vendor_common),
		plantsettings : [
			path.join(contextRoot, assets.scripts.path, 'plantsettings-page.js')
		].concat(common).concat(vendor_common),
		configsettings : [
			path.join(contextRoot, assets.scripts.path, 'configsettings-page.js')
		].concat(common).concat(vendor_common),
		emailsettings : [
			path.join(contextRoot, assets.scripts.path, 'emailsettings-page.js')
		].concat(common).concat(vendor_common),
		passwordsettings: [
			path.join(contextRoot, assets.scripts.path, 'passwordsettings-page.js')
		].concat(common).concat(vendor_common),
		statistics: [
			path.join(contextRoot, assets.scripts.path, 'statistics-page.js')
		].concat(common).concat(vendor_common),
		datauploadsettings: [
			path.join(contextRoot, assets.scripts.path, 'datauploadsettings-page.js')
		].concat(common).concat(vendor_common),
	};

// Do not parse vendor files
var noParse = [
	//path.join(contextRoot, assets.scripts.path, 'vendor'),
	path.join(contextRoot, assets.styles.path, 'vendor')
];


function isExternal(module) {
	var userRequest = module.userRequest;

	if (typeof userRequest !== 'string') {
		return false;
	}
	
	return userRequest.indexOf('bower_components') >= 0
			|| userRequest.indexOf('node_modules') >= 0
			|| userRequest.indexOf('libraries') >= 0;
}

// Plugins Config
var plugins = [
	//new webpack.NoErrorsPlugin(),
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery"
	}),

	new webpack.optimize.CommonsChunkPlugin({
		name : 'common',
		minChunks : 2
	}),
	
	//vendor_js contains all vendor specific packages which
	// are used by multiple pages
	new webpack.optimize.CommonsChunkPlugin({
		name : "vendor",
		minChunks : function(module) {
			return isExternal(module);
	}
	}),
	
	
//	new webpack.optimize.CommonsChunkPlugin({
//		names : [ "common_js", "vendor_js"],
//		minChunks : 3
//	}),	

	new ExtractTextPlugin(assets.styles.filename),

	//new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, languages),

	new ManifestRevisionPlugin(path.join('./', 'pvlogweb/manifest.json'), {
		rootAssetPath: rootAssetPath,
		ignorePaths: ['/fonts', '/styles', '/scripts']
	})
];

//Development environment only plugins.
if (node_env !== 'development') {
	var developmentPlugins = [
		new webpack.optimize.UglifyJsPlugin({
			compressor : {
				warnings : false
			}
		}),

		// http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
		new webpack.optimize.DedupePlugin()
	];

	plugins.push(developmentPlugins[0])
}

//the final webpack config
module.exports = {
	context : path.join(__dirname, './'),
	entry : chunks,
	output : {
		path : buildOutputPath,
		publicPath : publicPath,
		filename : assets.scripts.filename,
		chunkFilename : assets.scripts.chunkFilename
	},
//	externals : {
//		'jquery' : 'jQuery'
//	},
	resolve : {
		//Allow requiring files without supplying the extension.
		extensions : [ '', '.js', '.css', '.scss' ],
		modulesDirectories: ["web_modules", "node_modules", path.join(contextRoot, assets.scripts.path)]
	},
	module : {
		//noParse : noParse,
		loaders : [
				{
					test : /\.js$/i,
					loader : 'babel-loader?presets[]=es2015',
					exclude : /node_modules/
				},
				{
					test : /\.s?css$/i,
					loader : ExtractTextPlugin.extract('style-loader',
							'css-loader!postcss-loader!sass-loader?includePaths[]=' + path.join(contextRoot, assets.styles.path))
				},
				{
					test : /\.(jpe?g|png|gif|svg([\?]?.*))$/i,
					loaders : [
							'file?context=' + rootAssetPath + '&name=' + assets.images.filename, 'image?bypassOnDebug&optimizationLevel=7&interlaced=false' ]
				},
				{
					test : /\.(woff([\?]?.*)|woff2([\?]?.*))$/i,
					loader : 'url-loader?limit=100000'
				},
				{
					test : /\.(ttf([\?]?.*)|eot([\?]?.*))$/i,
					loader : 'file-loader?context=' + rootAssetPath + '&name=' + assets.fonts.filename
				},
				{	
					test: /\.json$/,
					loader: "json-loader"
				}
		]
	},
	plugins : plugins,
	postcss : [ AutoPrefixerPlugin() ]
};



