var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var node_modules = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require("extract-text-webpack-plugin");//抽离样式
var publicDir = './public';

function getEntry() {
    var jsPath = path.resolve(__dirname, 'entry');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(__dirname, 'entry', item);
        }
    });
    files['hotserver'] = 'webpack/hot/dev-server';
    return files;
}

module.exports = {
    entry: getEntry(),
    // entry: './entry/index.js',

    output: {
        path: 'public',
        filename: './js/[name].js',
        // filename: "./index.js",
        publicPath: '/'
    },

    module: {
        loaders: [
            {
                test: /\.js$/, exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
            {
                test: /\.css$/, exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // {test: /\.scss$/, exclude: /node_modules/, loaders: ["style?sourceMap", "css?sourceMap", "sass?sourceMap"]},
            {
                test: /\.scss?$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style", "css!sass")
            },
        ]
    },
    resolve: {
        alias: {
            util: __dirname + "/modules/util",
            module: __dirname + "/modules",
            css: __dirname + "/css",
            plugins: __dirname + "/plugins"
        }
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        //new TransferWebpackPlugin([{from: 'html', to: 'html'}], path.join(__dirname, "src")),
        new webpack.NoErrorsPlugin(),
        // new webpack.ProvidePlugin({
        //jQuery: "jquery",
        //$: "jquery",
        //_: "_",
        //Backbone: "Backbone",
        // util: "util"
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        // }),
        new ExtractTextPlugin("./css/styles.css"),
        // new webpack.optimize.CommonsChunkPlugin('./js/commons.js', getEntry()),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            minChunks: 2
        }),
        new webpack.BannerPlugin(new Date().toLocaleDateString() + ' author:liuxiaofan')

    ]
};
