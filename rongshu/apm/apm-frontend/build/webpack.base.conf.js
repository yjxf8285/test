var path = require('path');
var utils = require('./utils');
var config = require('../config');
var deploy = require('../config/deploy');
var vueLoaderConfig = require('./vue-loader.conf');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ["babel-polyfill", "./src/main.js"],
    // vue: ['vue'],
    // 'element-ui': ['element-ui'],
    // jquery: ['jquery'],
    // lodash: ['lodash'],
    // vendor: ['vue', 'jquery', 'lodash', 'element-ui']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '_components': resolve('src/components'),
      '_charts': resolve('src/components/charts'),
      '_dashboard': resolve('src/components/dashboard'),
      '_topo': resolve('src/components/topo'),
      '_ui-mod': resolve('src/components/ui-mod'),
      'vars': resolve('src/assets/vars.scss'),
      '_util': resolve('src/util.js'),
      '_cbl': resolve('src/common-business-logic.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('backend')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: deploy.imgBaseLimit,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('css/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
