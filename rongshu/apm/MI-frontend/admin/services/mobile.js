let Runtime = require('../runtime')
// let httpclient = Runtime.App.httpClient

module.exports = {
  '/api/mobile/application/list': {
    method: 'post',
    mock: {
      'list|5-50': [{
        'id|+1': 1,
        'name|4-10': '@first',
        'type|1': ['apple', 'android'],
        'rpmRate|10-20.2-5': 11,
        'httpErrorRate|10-20.2-5': 11,
        'netErrorRate|10-20.2-5': 11,
        'liveUserCount|0-10': 1,
        'liveVersionCount|0-10': 1,
        'avgResponseTime|+1': function () {
          return +Runtime.Mock.mock('@datetime(T)')
        },
        'firstByteTime|+1': function () {
          return +Runtime.Mock.mock('@datetime(T)')
        }
      }],
      'total|20-100': 1
    }
    // callback: function (req, res, callback) {
    //   req.query.condition = encodeURIComponent(req.query.condition)
    //   httpclient.get({
    //     url: '/api/bms/users',
    //     query: req.query
    //   }).then(function (responseData) {
    //     callback(responseData)
    //   })
    // }
  }
  // '/mobile/dashboard/version-list': {
  //   method: 'post',
  //   mock: {
  //     'list|1-1': ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8']
  //   }
  // }
}
