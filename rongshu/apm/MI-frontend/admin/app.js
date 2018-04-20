/**
 * @author: jiangfeng
 * @summary: App运行入口文件
 */
let express = require('express')
let Runtime = require('./runtime')
let midwares = require('./midwares')

var app = express()
Runtime.App.Log.use(app, Runtime.App.AppConfig)
let logger = Runtime.App.Log.helper
app.logger = logger
// 注册Session/Cookie持久化存储
Runtime.SessionStore.use(app, Runtime.App.AppConfig)
// 视图解析
Runtime.ViewParser.use(app, Runtime.App.AppConfig)

// 注册国际化
Runtime.Internationalization.use(app, Runtime.App.AppConfig)

// 全局跨域设置
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'accept, content-type')
  res.setHeader('X-Powered-By', 'APM')
  next()
})

// 启用授权
// Runtime.Authorization.use(app, [midwares.auth.apiAuth])

// 注册路由与服务
Runtime.Router.use(app, Runtime.App.AppConfig)

module.exports = app
