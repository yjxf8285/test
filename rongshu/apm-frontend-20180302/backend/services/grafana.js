let Runtime = require('../runtime/index')
let Modules = require('../modules')
let SessionStore = Runtime.SessionStore
let log = Runtime.App.Log.helper
let methods = ['getTopoData', 'getWebTop5', 'getWebTransactionTps', 'getWebTransactionAvgResponseTime', 'getDatabaseTop5', 'getDatabaseTps', 'getDatabaseAvgResponseTime', 'getErrorRateCount']
let descs = ['拓扑图', 'TOP5应用慢事务响应时间', 'WEB应用吞吐量', 'WEB应用平均响应时间', 'top5慢数据库操作响应时间', '数据库调用吞吐量', '数据库调用平均响应时间', '错误率']

let grafana = {

  '/api/grafana/search': {
    method: 'all',
    mock: false,
    callback: function(req, res, callback) {
      callback(descs)
    }
  },

  '/api/grafana/query': {
    method: 'post',
    mock: false,
    callback: function(req, res, callback) {
      let target = req.body.targets
      let params = {}
      SessionStore.getSysInfoAsync(req)
        .then(result => {
          if (result) {
            params.systemId = result.systemId
            params.interval = result.interval
            if (target && target.length > 0) {
              let method = getMethodByDesc(target[0].target)
              Modules.grafana[method](params)
                .then(result => {
                  callback(result)
                })
                .catch(ex => {
                  log.warn(result)
                  callback({
                    success: false,
                    code: -1,
                    msg: result
                  })
                })
            } else {
              callback({
                success: false,
                code: -1,
                msg: '参数丢失'
              })
            }
          } else {
            log.warn(result)
            callback({
              success: false,
              code: -1,
              msg: result
            })
          }
        })
    }
  }
}

function getMethodByDesc(desc) {
  let index = 0
  for (var i = 0; i < descs.length; i++) {
    if (descs[i] === desc) {
      index = i
      break
    }
  }
  return methods[index]
}

module.exports = grafana
