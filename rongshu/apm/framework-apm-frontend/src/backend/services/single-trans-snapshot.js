module.exports = app => {
  return {
    '/api/server/v2/transaction/snapshot/topology-info': {
      method: 'get',
      request: (req, res, responseData) => {
        // 节点：selfElapsed，requestIds.length, error,health ,百分比：selfElapsed / elapsedTime
        if (responseData.data && responseData.data.links) {
          responseData.data.links.forEach(link => {
            link.times = link.selfElapsed
          })
        }
        app.modules.topo.fixData(responseData.data)
      }
    }
  }
}
