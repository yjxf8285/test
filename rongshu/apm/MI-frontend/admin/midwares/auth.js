let Modules = require('../modules')
let Runtime = require('../runtime')
var log = Runtime.App.Log.helper
let Utils = Runtime.App.Utils
let SessionStore = Runtime.SessionStore
var outAuthServices = Runtime.App.AppConfig.app.outAuthServices

function checkSessionAsync (req, res) {
  let token = SessionStore.getXAuthToken(req)

  if (!token) {
    return new Promise((resolve, reject) => {
      // 验证Token是否有效
      resolve(false)
    })
  }

  return Modules.sso.checkAsync(token)
    .then(result => {
      if (result && result.success) {
        return true
      } else {
        SessionStore.clearSession(req)
        return false
      }
    })
}
module.exports = {
  apiAuth: function (req, res, next) {
    if (process.env.NODE_ENV === 'development') {
      return next()
    }
    // 服务授权验证
    if (/^\/api\//.test(req.path)) {
      if (outAuthServices.indexOf(req.path.toLowerCase()) >= 0) {
        return next()
      }
      checkSessionAsync(req, res).then(result => {
        if (result) { next() } else {
          res.status(200).json({
            success: false,
            code: Utils.RuntimeCodes.FaildAuthorizedUser.code,
            msg: Utils.RuntimeCodes.FaildAuthorizedUser.msg
          })
          res.end()
        }
      })
    } else {
      next()
    }
  }
}
