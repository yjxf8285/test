module.exports = app => {
  return {
    '/api/errorRate/top': {
      method: 'get',
      afterRequest: (req, res, responseData) => {
        responseData.data.forEach((e, i) => {
          e.max = 0
          e.min = 0
          e.avg = e.count
        })
      }
    }
  }
}
