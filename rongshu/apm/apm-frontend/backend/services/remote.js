let Mock = require('mockjs')
module.exports = {
  '/api/server/v2/remote/initiator': {
    method: 'get',
    mock: {
      on: true,
      dataRegular: function() {
        var list = []
        for (var i = 0; i < 10; i++) {
          list.push(Mock.Random('@ctitle(5,10)'))
        }
        return list
      }
    },
    callback: function(req, res, callback) {

    }
  },
  '/api/server/v2/remote/errortypes': {
    method: 'get',
    mock: {
      on: true,
      dataRegular: function() {
        var list = []
        list.push(400)
        list.push(404)
        list.push(500)
        list.push(505)
        return list
      }
    },
    callback: function(req, res, callback) {

    }
  }
}
