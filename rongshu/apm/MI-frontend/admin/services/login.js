let Runtime = require('../runtime/index')
let Modules = require('../modules')
let SessionStore = Runtime.SessionStore

module.exports = {
  '/api/user/logout': {
    method: 'post',
    request: function (req, res, callback) {
      var actionResult = {}
      req.session.reload(function () {
        console.log(req.sessionID)
        let sessionId = SessionStore.getSessionId(req)
        let accessInfo = SessionStore.getAccessInfo(req)
        if (sessionId && accessInfo && accessInfo.accessToken) {
          Modules.sso.logoutAsync(sessionId, accessInfo.accessToken)
            .then((result) => {
              req.session.cookie.maxAge = 0
              actionResult.code = 0
              actionResult.success = true
              actionResult.msg = ''
              callback(actionResult)
            })
        } else {
          req.session.cookie.maxAge = 0
          actionResult.code = 0
          actionResult.success = true
          actionResult.msg = ''
          callback(actionResult)
        }
      })
    }
  },
  '/api/user/test': {
    method: 'get',
    mock: {
      user: 1
    },
    beforeRequest: function (req, res) {
      console.log(req.query)
      req.query.id = 1
    },
    request: function (req, res, callback) {
      console.log(req.session)
      console.log(req.query)
      callback({
        success: true,
        msg: req.sessionID
      })
    },
    afterRequest: function (req, res, responseData) {
      responseData.data = 11
    }
  },
  '/api/user/test1': {
    method: 'post',
    mock: {
      user: 1
    },
    beforeRequest: function (req, res) {
      console.log(req.query)
      req.body.id = 1
    },
    request: function (req, res, callback) {
      console.log(req.session)
      console.log(req.query)
      callback({
        success: true,
        msg: req.sessionID
      })
    },
    afterRequest: function (req, res, responseData) {
      responseData.data = 11
    }
  }
}
