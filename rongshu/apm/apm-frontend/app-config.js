/**
 * 应用配置文件
 */
var env = process.argv[2]
let deepAssign = require('deep-assign')
let baseConfig = require('./app.config/app.config')
let AppConfig = require('./app.config/app.config' + (env ? ('.' + env) : '.development'))
let config = deepAssign({}, baseConfig, AppConfig)

module.exports = {
  apiHost: 'http://127.0.0.1:' + config.runtime.listenPort,
  localport: 9999,
  autoOpenBrowser: true // 启动时是否自动打开浏览器
}
