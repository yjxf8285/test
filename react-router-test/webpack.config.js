var webpack = require('webpack')
module.exports = {
    entry: './js/index.js',

    output: {
        path: 'public',
        filename: '[name].bundle.js',
        publicPath: '/',
        chunkFilename: "[name].chunk.js"
    },
    resolve: {
        alias: {
            modules: __dirname + "/modules",
        }
    },
    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ] : [],
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react'}
        ]
    }
}


