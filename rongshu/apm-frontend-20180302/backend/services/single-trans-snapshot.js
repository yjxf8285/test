let Modules = require('../modules')
module.exports = {
  '/server/v2/transaction/snapshot/topology-info': function(req, res, responseData) {
    // 节点：selfElapsed，requestIds.length, error,health ,百分比：selfElapsed / elapsedTime

    if (responseData.data && responseData.data.links) {
      responseData.data.links.forEach(link => {
        link.times = link.selfElapsed
      })
    }
    Modules.topo.fixData(responseData.data)
  }
}
