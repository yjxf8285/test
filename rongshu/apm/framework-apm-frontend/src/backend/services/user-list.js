let utils = require('apm-frontend-framework').Utils
let Mock = require('mockjs')
module.exports = app => {
  return {
    '/api/users': {
      method: 'get',
      mock: {
        on: true,
        /**
       * https://github.com/nuysoft/Mock
       */
        dataRegular: {
          'users|10': [{
            'id|+1': 1,
            'company': '@ctitle(5,10)',
            'name': '@first @last',
            'userName': '@first @last',
            'password': '@first @last',
            'email': '@email',
            'tel': /^1[34578][0-9]\d{8}$/,
            'createTime|+1': function () { return +Mock.mock('@datetime(T)') },
            'modifyTime|+1': function () { return +Mock.mock('@datetime(T)') }
          }],
          'orderField': '',
          'orderFieldType': '',
          'currentPage': 1,
          'pageSize': 10,
          'totalNum': 131
        }
      },
      request: function (req, res, callback) {
        req.query.condition = encodeURIComponent(req.query.condition)
        utils.httpClient.get({
          url: '/api/bms/users',
          query: req.query
        }).then(responseData => callback(responseData))
      }
    },
    '/api/decimal': {
      method: 'post',
      request: function (req, res, callback) {
        callback(req.body)
      }
    }
  }
}
