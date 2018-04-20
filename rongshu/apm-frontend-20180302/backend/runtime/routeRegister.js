/**
 * @author jiangfeng
 * @summary 路由处理器
 * @desc 遍历对应文件夹下得所有文件，将其解析为对应的路由
 */
let fs = require('fs')
let Path = require('path')
let ServiceHandler = require('./serviceHandler')
/**
 * 获取某个文件夹下的所有文件，输出为列表
 * @param {*String} path
 */
function getFiles(path) {
  path = Path.join(Path.resolve(), path)
  let fileList = []
  let folderList = []
  let walk = function(path, fileList, folderList) {
    let files = fs.readdirSync(path)
    files.forEach(function(item) {
      let tmpPath = path + '/' + item
      let stats = fs.statSync(tmpPath)
      if (stats.isDirectory()) {
        walk(tmpPath, fileList, folderList)
        folderList.push(tmpPath)
      } else {
        fileList.push(tmpPath)
      }
    })
  }
  walk(path, fileList, folderList)
  return fileList
}

/**
 * 注册服务
 * @param {*Express} app
 * @param {*Object} appConfig 配置对象
 */
function serviceRegister(app, appConfig) {
  // release环境不走mock模式
  let serviceDirectory = appConfig.app.serviceDirectory
  var services = getFiles(serviceDirectory)
  var serviceObject = {}
  services.forEach(function(item) {
    let service = require(item)
    serviceObject = Object.assign(serviceObject, service)
  })

  app.use('/', ServiceHandler(serviceObject).router)
}

/**
 *注册路由
 * @param {*Express} app Express实例
 * @param {*Object} appConfig 配置对象
 */
function routeRegister(app, appConfig) {
  let routerDirectory = appConfig.app.routeDirectory
  var routes = getFiles(routerDirectory)
  routes.forEach(function(item) {
    let route = require(item)
    app.use('/', route)
  })
}

exports.use = function(app, appConfig) {
  routeRegister(app, appConfig)
  serviceRegister(app, appConfig)
}
