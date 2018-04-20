module.exports = app => {
  return {
    '/api/webTransaction/tps': {
      method: 'get',
      request: app.modules.common.avgMinuteCount
    },
    '/api/webTransaction/top': {
      method: 'get',
      request: (request, response, responseData) => {
        responseData.data.map(m => {
          m.avg = app.modules.common.toDecimal(m.avg)
        })
      }
    },
    '/api/dataBase/top': {
      method: 'get',
      request: (request, response, responseData) => {
        responseData.data.map(m => {
          m.avg = app.modules.common.toDecimal(m.avg)
        })
      }
    },
    '/api/dataBase/tps': {
      method: 'get',
      request: app.modules.common.avgMinuteCount
    },
    '/api/dataBase/tpsFromSQL': {
      method: 'get',
      request: app.modules.common.avgMinuteCount
    }
  }
}
