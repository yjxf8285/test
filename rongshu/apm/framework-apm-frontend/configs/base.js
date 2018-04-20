/**
 * 基础的配置文件
 * 其中的appName为当前app的名称，其直接决定了构建时的base路由地址。
 */
const path = require('path')
module.exports = {
  appName: 'apm',
  webpack: {
    deploy: {
      imgBaseLimit: 10000
    },
    build: {
      dev: '"production"',
      index: path.resolve(__dirname, '../dist/views/index.html'),
      viewTemplatePath: path.resolve(__dirname, '../node_modules/apm-frontend-framework/src/backend/views/index.html'),
      distRoot: path.resolve(__dirname, '../dist'),
      assetsRoot: path.resolve(__dirname, '../dist/assets'),
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      productionSourceMap: false,
      productionGzip: false,
      devtool: '#source-map',
      productionGzipExtensions: ['js', 'css'],
      bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
      env: '"development"',
      host: 'localhost',
      port: 9999,
      autoOpenBrowser: false,
      staticAssetPath: path.resolve(__dirname, '../src/site/static'),
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      viewTemplatePath: path.resolve(__dirname, '../node_modules/apm-frontend-framework/src/backend/views/index.html'),
      errorOverlay: true,
      notifyOnErrors: true,
      poll: false,
      useEslint: true,
      showEslintErrorsInOverlay: false,
      devtool: 'cheap-module-eval-source-map',
      cacheBusting: true,
      cssSourceMap: false
    }
  },
  directory: {
    static: './dist/assets',
    view: './dist/views',
    service: './src/backend/services',
    router: './src/backend/routers',
    module: './src/backend/modules'
  },
  writeList: {
    routers: ['/login'],
    services: ['/api/framework/login']
  },
  sdkSrc: './'
}
