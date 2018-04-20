'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

var env = 'development'
let envConfig = require('../app')(env).config
let envWebpackConfig = envConfig.webpack
process.env.NODE_ENV = JSON.parse(envWebpackConfig.dev.env)

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = {}
proxyTable['/' + envConfig.proxyApiPrefix] = 'http://localhost:' + envConfig.listenPort
const HOST = process.env.HOST
const PORT = process.env.PORT || envWebpackConfig.dev.port

console.log(proxyTable)
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: envWebpackConfig.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: envWebpackConfig.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(envWebpackConfig.dev.assetsPublicPath, 'index.html') }
      ]
    },
    hot: true,
    // since we use CopyWebpackPlugin.
    contentBase: false,
    compress: true,
    host: HOST || envWebpackConfig.dev.host,
    port: PORT || envWebpackConfig.dev.port,
    open: envWebpackConfig.dev.autoOpenBrowser,
    overlay: envWebpackConfig.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: envWebpackConfig.dev.assetsPublicPath,
    proxy: proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: envWebpackConfig.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: envWebpackConfig.dev.env }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: envWebpackConfig.dev.viewTemplatePath,
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: envWebpackConfig.dev.staticAssetPath,
        to: envWebpackConfig.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || envWebpackConfig.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer envWebpackConfig
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: envWebpackConfig.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
