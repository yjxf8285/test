/**
 * Created by 晓帆 on 2/25 025.
 * webpack配置文件
 */
'use strict';
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var node_modules = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var srcDir = 'src';

function getEntry() {
    var jsPath = path.resolve(srcDir, 'js/entry');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js/entry', item);
        }
    });
    files['hotserver'] = 'webpack/hot/dev-server';
    return files;
}

module.exports = {
    cache: true,
    //devtool: "eval-source-map",
    entry: getEntry(),
    //entry: [
    //    'webpack/hot/only-dev-server',
    //    path.resolve(__dirname, 'src/js/entry/index.js')
    //],
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: 'http://localhost:8080/',//本地开发服务器地址
        //publicPath: 'http://localhost/',//线上服务器地址
        //filename: 'index.js',
        filename: "./js/[name].js"
    },
    module: {
        loaders: [
            {test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            { test: /\.scss$/, exclude: /node_modules/, loaders: ["style?sourceMap", "css?sourceMap", "sass?sourceMap"]},
            {test: /\.(png|jpg|gif)$/, exclude: /node_modules/, loader: 'url?limit=25000&name=img/[name].[ext]'}
        ],
        //noParse: [/.elm$/]
    },
    resolve: {
        alias: {
            jquery: node_modules + "/jquery/dist/jquery.min.js",
            util: __dirname + "/src/js/util.js",
            //core: srcDir + "/js/core",
            //ui: srcDir + "/js/ui"
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //new TransferWebpackPlugin([{from: 'html', to: 'html'}], path.join(__dirname, "src")),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            util: "util"
        }),
        //new CommonsChunkPlugin('common.js'),
        new webpack.BannerPlugin(new Date().toLocaleDateString() + ' author:liuxiaofan'),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    },
        //    mangle: {
        //        except: ['$super', '$', 'exports', 'require']
        //    }
        //})
    ]
};
