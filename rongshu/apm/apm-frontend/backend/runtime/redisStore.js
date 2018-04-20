/**
 * @author jiangfeng
 * @summary Redis存储服务配置,支持两种模式：local,cluster
 */
let session = require(('express-session'))
let RedisStore = require('connect-redis')(session)
let IORedis = require('ioredis')
let AppConfig = require('./App/AppConfig')
let log = require('./App/log').helper

let redisMode = AppConfig.runtime.redis.mode
let redisConfig = AppConfig.runtime.redis
let store = null
module.exports.getInstance = function() {
  if (!store) {
    log.info('初始化当前应用Redis模式为' + redisMode)
    if (redisMode === 'cluster') {
      store = new RedisStore({
        logErrors: true,
        prefix: AppConfig.runtime.session.prefix,
        unset: 'destroy',
        client: new IORedis.Cluster(redisConfig.cluster)
      })
    } else if (redisMode === 'sentinel') {
      store = new RedisStore({
        logErrors: true,
        prefix: AppConfig.runtime.session.prefix,
        unset: 'destroy',
        client: new IORedis(redisConfig.sentinel)
      })
    } else if (redisMode === 'local') {
      store = new RedisStore({
        host: redisConfig.local.host,
        port: redisConfig.local.port,
        pass: redisConfig.local.pass,
        logErrors: true,
        prefix: AppConfig.runtime.session.prefix,
        unset: 'destroy'
      })
    }
  }
  return store
}
