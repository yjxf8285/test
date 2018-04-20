let Modules = require('../modules')

let topo = {
  '/api/agent/sys/topology': {
    method: 'post',
    mock: false,
    callback: function(req, res, callback) {
      var systemId = req.body.systemId // '8926629972690619042'
      var interval = req.body.interval
      var result = {}
      if (systemId && interval) {
        // req.body.systemId = systemId
        Modules.topo.getTopoData(req.body)
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
    mock: false,
    callback: function(req, res, callback) {
      let result = {}
      let condition = req.body.condition
      if (condition) {
        Modules.topo.getDashBoardTopoData(condition)
          .then(result => {
            console.log('lxf<<<', result)
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
    mock: false,
    callback: function(req, res, callback) {
      let result = {}
      let condition = req.body.condition
      if (condition) {
        Modules.topo.getTransSecondTopoData(condition)
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

module.exports = topo
