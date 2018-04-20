'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../configs/base').webpack
const vueLoaderConfig = require('./vue-loader.conf')
let appName = process.argv[2] || ''
// 解析打包时传递的参数，为不同的appName打包不同路径的静态资源
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    index: './src/site/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? (appName ? config.build.assetsPublicPath + appName + '/' : config.build.assetsPublicPath)
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src/site'),
      'vars': resolve('src/site/style/_vars.scss'),
      '_framework': resolve('node_modules/apm-frontend-framework/lib/components'),
      '_echarts': process.env.NODE_ENV === 'production' ? resolve('src/site/components/charts/echarts/echarts.min.js') : resolve('src/site/components/charts/echarts/echarts.js'),
      '_d3': process.env.NODE_ENV === 'production' ? resolve('src/site/components/topo/lib/d3.min.js') : resolve('src/site/components/topo/lib/d3.js'),
      '_components': resolve('src/site/components'),
      '_helpers': resolve('src/site/helpers'),
      '_common': resolve('src/site/common.js'),
      '_utils': resolve('src/site/helpers/utils'),
      '_store': resolve('src/site/helpers/store'),
      '_mixins': resolve('src/site/mixins')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/site'), resolve('node_modules/admin-ui/src'), resolve('node_modules/apm-frontend-framework/lib/components'), resolve('node_modules/webpack-dev-server/client')],
        exclude: [resolve('src/site/components/charts/echarts')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: config.deploy.imgBaseLimit,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
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
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
