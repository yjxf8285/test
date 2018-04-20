// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var buildRoot = '../../public/'
var Runtime = require('../../admin/runtime')
var devProxyPort = +Runtime.App.Utils.getConfig('development').runtime.listenPort
var devPort = 8080
if (devProxyPort === devPort) {
  console.error('dev proxy port can\'t equal dev port')
  return
}
module.exports = {
  build: {
    env: require('./production'),
    index: path.resolve(__dirname, buildRoot, './fe/views/index.html'),
    publicRoot: path.resolve(__dirname, buildRoot),
    zipRoot: path.resolve(__dirname, '../../zip/'),
    // front end assets root path
    assetsRoot: path.resolve(__dirname, buildRoot, './fe'),
    // use it when build the app
    assetsBuildRoot: path.resolve(__dirname, buildRoot, './fe/assets'),
    // front end assets sub directroy path
    assetsSubDirectory: 'static',
    // front end url root path
    assetsPublicPath: '/',
    // back end runtime root path
    runtimeRoot: path.resolve(__dirname, buildRoot, './be'),
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./development'),
    port: 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': 'http://127.0.0.1:' + devProxyPort
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
