
module.exports = app => {
  let sessionStore = app.modules.framework.sessionStore
  let sso = app.modules.framework.sso
  return {
    '/api/test': {
      method: 'get',
      beforeRequest: function(req, res) {
        console.log(req.query)
        req.query.id = 1
      },
      request: function(req, res, callback) {
        console.log(sessionStore)
        console.log(sso)
        callback({
          success: true,
          msg: req.sessionID
        })
      },
      afterRequest: function(req, res, responseData) {
        responseData.data = 'app1'
      }
    }
  }
}
