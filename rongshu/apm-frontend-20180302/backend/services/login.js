let Runtime = require('../runtime/index')
let log = Runtime.App.Log.helper
let Modules = require('../modules')
let SessionStore = Runtime.SessionStore

module.exports = {
  '/api/user/logout': {
    method: 'post',
    mock: false,
    callback: function(req, res, callback) {
      var actionResult = {}
      req.session.reload(function() {
        let xAuthToken = SessionStore.getXAuthToken(req)
        if (xAuthToken) {
          Modules.sso.logoutAsync(xAuthToken)
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
  '/api/user/login': {
    method: 'post',
    validate: [{
      field: 'username',
      options: {
        required: true,
        missingMessage: '用户名不可为空'
      }
    }, {
      field: 'password',
      options: {
        required: true,
        missingMessage: '密码不可为空'
      }
    }],
    mock: false,
    callback: function(req, res, callback) {
      Modules.sso.loginAsync(req.body.username, req.body.password)
        .then(responseData => {
          if (responseData.success && responseData.code === 0) {
            SessionStore.setXAuthToken(req, responseData.data.ticket)
            SessionStore.setUserId(req, responseData.data.ticket)
            SessionStore.setUserName(req, responseData.data.user ? responseData.data.user.name : '')
            SessionStore.setUserInfo(req, responseData.data.user)
            // responseData.data.ticket = ''
          }
          callback(responseData)
        })
        .catch(ex => {
          log.error(ex)
          callback({
            success: false
          })
        })
    }

  },
  '/api/user/config': {
    method: 'post',
    mock: false,
    callback: function(req, res, callback) {
      let userName = SessionStore.getUserName(req)
      callback({
        success: true,
        code: 0,
        msg: '',
        data: {
          token: SessionStore.getXAuthToken(req),
          logoUrl: Runtime.App.AppConfig.app.logoUrl,
          userName: userName,
          loginUrl: Runtime.App.AppConfig.runtime.sso.outerHost,
          outerRemoteHost: Runtime.App.AppConfig.app.outerRemoteHost,
          resources: [],
          alarmHost: Runtime.App.AppConfig.app.alarmHost,
          grafanaLoginUrl: Runtime.App.AppConfig.app.grafana.host + Runtime.App.AppConfig.app.grafana.login,
          grafanafullScreenUrl: Runtime.App.AppConfig.app.grafana.host + Runtime.App.AppConfig.app.grafana.fullScreenUrl
        }
      })
    }
  },
  '/api/user/test': {
    method: 'get',
    mock: false,
    callback: function(req, res, callback) {
      console.log(req.session)
      callback({
        success: true,
        msg: req.sessionID
      })
    }
  }
}
