/**
 * @author: jiangfeng
 * @summary: elasticsearch test
 */
let Runtime = require('../runtime/index')
let esclient = Runtime.ESClient.getInstance()
let bodyBuilder = require('bodybuilder')
// let httpclient = Runtime.App.httpClient
let log = Runtime.App.Log.helper
// let Mock = require('mockjs')
module.exports = {
  '/api/es/search': {
    method: 'post',
    beforeRequest: function (req, res) {
      log.info('本次请求的body:')
      log.info(req.body)
      this.queryBody = {
        'index': 'agent-span',
        'type': 'span',
        'body': {
          'query': {
            'bool': {
              'must': [{
                'match_all': {}
              }],
              'must_not': [],
              'should': []
            }
          },
          'from': 0,
          'size': 10,
          'sort': [],
          'aggs': {}
        }
      }
    },
    request: function (req, res, callback) {
      if (!esclient) {
        return callback({
          success: true,
          data: {}
        })
      }

      esclient.search(this.queryBody).then(body => {
        callback({
          success: true,
          data: body
        })
      })
        .catch(ex => {
          log.error(ex)
        })
    },
    afterRequest: function (req, res, responseData) {

    }
  }
}
