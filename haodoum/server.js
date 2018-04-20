/**
 * Created by 晓帆 on 3/3 003.
 *
 */
'use strict';
var webpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config.js");
//config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
var webpack = require("webpack");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
    hot: true,
    contentBase: "/build",
    //headers: { "X-Custom-Header": "yes" },
    stats: { colors: true },
    proxy: {
        '*': 'https://h5.test.intra.qiaoshoutete.com:8090',
    }
});
server.listen(8080, "localhost", function() {});
