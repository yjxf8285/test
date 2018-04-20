/**
 * @author jiangfeng
 * @summary Redis存储服务配置,支持两种模式：local,cluster
 */
let elasticsearch = require('elasticsearch')
let AppConfig = require('./App/AppConfig')

let esConfig = AppConfig.runtime.elasticsearch
let esClient = null
module.exports.getInstance = function () {
  if (!esClient) {
    if (AppConfig.runtime.elasticsearch.disabled) {
      console.info('当前应用已停用ES模块.')
    } else {
      esClient = new elasticsearch.Client(esConfig)
      esClient.ping({
        requestTimeout: 30000
      }, error => {
        if (error) {
          console.error('elasticsearch cluster is down!')
        } else {
          console.log('everything is fine.')
        }
      })
    }
  }
  return esClient
}
