/**
 * Created by liuxiaofan on 2017/9/29.
 */
// let Runtime = require('../runtime/index')
// let httpclient = Runtime.App.httpClient
// let log = Runtime.App.Log.helper
let Mock = require('mockjs')
module.exports = {
  '/api/testlxf': {
    method: 'post',
    beforeRequest: function (req, res) {
      console.log(req.query)
      req.query.id = 1
    },
    request: function (req, res, callback) {
      let data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'data|1-10': [{
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1
        }]
      })
      let resData = Object.assign({}, {
        success: true,
        msg: req.sessionID
      }, data)
      callback(resData)
    },
    afterRequest: function (req, res, responseData) {
      // responseData.data = [
      //   {
      //     name: 'lxf',
      //     age: 20
      //   }
      // ]
    }
  }
}
