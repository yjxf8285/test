/**
 * Created by liuxiaofan on 2017/1/5.
 */
var webpack = require('webpack');
const config = {
    output: {
        filename: 'client-bundle.js',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
            },
        ],
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        //new TransferWebpackPlugin([{from: 'html', to: 'html'}], path.join(__dirname, "src")),
        new webpack.NoErrorsPlugin(),
    ]
};
module.exports = config;