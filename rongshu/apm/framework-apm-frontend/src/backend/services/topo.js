let topo = app => {
  return {
    '/api/agent/sys/topology': {
      method: 'post',
      request: function (req, res, callback) {
        var systemId = req.body.systemId
        var interval = req.body.interval
        var result = {}
        if (systemId && interval) {
          app.modules.topo.getTopoData(req.body)
            .then(result => {
              callback(result)
            })
        } else {
          result.code = -1
          result.success = false
          result.msg = '参数错误！'
          callback(result)
        }
      }
    },
    // 仪表盘拓扑
    '/api/server/v2/application/dashboard/topology-graph': {
      method: 'post',
      request: function (req, res, callback) {
        let result = {}
        let condition = req.body.condition
        if (condition) {
          app.modules.topo.getDashBoardTopoData(condition)
            .then(result => {
              callback(result)
            })
        } else {
          result.code = -1
          result.success = false
          result.msg = '参数错误！'
          callback(result)
        }
      }
    },
    // 事务2级拓扑
    '/api/server/v2/transaction/second-topology': {
      method: 'post',
      request: function (req, res, callback) {
        let result = {}
        let condition = req.body.condition
        if (condition) {
          app.modules.topo.getTransSecondTopoData(condition)
            .then(result => {
              callback(result)
            })
        } else {
          result.code = -1
          result.success = false
          result.msg = '参数错误！'
          callback(result)
        }
      }
    }
  }
}
module.exports = topo
