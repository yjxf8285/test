/**
 * @author: jiangfeng
 * @summary: 加载配置文件
 * 两种模式：
 * 1. 如果在根路径下存在config.json，就使用 config.json作为系统运行的配置
 * 2. 否则使用admin下的config规则生成系统运行的配置
 */
let path = require('path')
let fs = require('fs')
let configer = require('./utils/config.js')
var configRootPath = path.resolve(__dirname, '../../../config.json')
let config = {}

if (fs.existsSync(configRootPath)) {
  config = require(configRootPath)
  process.env.NODE_ENV = config.env
} else {
  config = configer.getConfig(process.env.NODE_ENV)
  config.env = process.env.NODE_ENV
}

module.exports = config
