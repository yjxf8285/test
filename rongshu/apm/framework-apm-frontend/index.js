process.env.NODE_ENV = process.env.NODE_ENV || 'development'
let utils = require('apm-frontend-framework').Utils
let app = require('./app')()
// let apiAuth = midwares.auth.apiAuth
// app.authRegister(apiAuth)
let proxyApiService = app => {
  return {
    beforeRequest: function (req, res) {
      console.warn('proxy api service midware before request exec.')
    },
    afterRequest: function (req, res, responseData) {
      app.app.modules.common.formatObjectDecimal(responseData)
      console.warn('proxy api service midware after request exec.')
    }
  }
}

function checkSessionAsync (req, res) {
  let sessionID = req.sessionID
  let userID = req.session.userID

  if (!(sessionID && userID)) {
    return new Promise((resolve) => {
      // 验证Token是否有效
      resolve(false)
    })
  } else {
    return new Promise((resolve) => {
      // 验证Token是否有效
      resolve(true)
    })
  }
}
let apiAuth = app => {
  var outAuthServices = app.EE_EXPRESS_CONFIG.writeList.services
  return function (req, res, next) {
    let apiRegExp = new RegExp('^\\/' + app.EE_EXPRESS_CONFIG.proxyApiPrefix + '\\/')
    if (process.env.NODE_ENV === 'development') {
      return next()
    }
    // 服务授权验证
    if (apiRegExp.test(req.path)) {
      if (outAuthServices.indexOf(req.path.toLowerCase()) >= 0) {
        return next()
      }
      checkSessionAsync(req, res).then(result => {
        if (result) { next() } else {
          res.status(200).json({
            success: false,
            code: utils.codes.RuntimeCodes.FaildAuthorizedUser.code,
            msg: utils.codes.RuntimeCodes.FaildAuthorizedUser.msg
          })
          res.end()
        }
      })
    } else {
      next()
    }
  }
}

app.proxyApiServiceRegister(proxyApiService(app))
app.authRegister(apiAuth)
app.init()
app.run()
