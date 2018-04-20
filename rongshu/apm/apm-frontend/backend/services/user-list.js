let Runtime = require('../runtime/index')
let Mock = require('mockjs')

module.exports = {
  '/api/users': {
    method: 'get',
    mock: {
      on: true,
      /**
       * https://github.com/nuysoft/Mock
       */
      dataRegular: {
        'users|1-17': [{
          'id|+1': 1,
          'company': '@ctitle(5,10)',
          'name': '@first @last',
          'userName': '@first @last',
          'password': '@first @last',
          'email': '@email',
          'tel': /^1[34578][0-9]\d{8}$/,
          'createTime|+1': function() { return +Mock.mock('@datetime(T)') },
          'modifyTime|+1': function() { return +Mock.mock('@datetime(T)') }
        }],
        'orderField': '',
        'orderFieldType': '',
        'startIndex': 1,
        'pageSize': 17,
        'totalNum': 131
      }
    },
    callback: function(req, res, callback) {
      req.query.condition = encodeURIComponent(req.query.condition)
      var httpClient = new Runtime.App.HttpClient({
        req: req,
        res: res,
        urlPath: '/api/bms/users',
        queryParams: req.query
      })
      httpClient.get(function(responseData) {
        callback(responseData)
      })
    }
  },
  '/api/decimal': {
    method: 'post',
    callback: function(req, res, callback) {
      Runtime.App.Utils.formatObjectDecimal(req.body)
      callback(req.body)
    }
  }
}
