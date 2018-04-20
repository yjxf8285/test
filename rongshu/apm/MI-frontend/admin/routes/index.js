var express = require('express')
const crypto = require('crypto')
let Runtime = require('../runtime')
var router = express.Router()
var log = Runtime.App.Log.helper
let HttpClient = Runtime.App.HttpClient
let config = Runtime.App.AppConfig.runtime.sso

let SessionStore = Runtime.SessionStore

let Modules = require('../modules')

router.get('/*', function (req, res, next) {
  let lang = req.query.lang || 'zh-CN'
  res.cookie('lang', lang, {
    maxAge: 1000 * 3600 * 24 * 7,
    httpOnly: true
  })
  res.setLocale(lang)
  next()
})

function renderIndex (res, token) {
  res.render('index', {
    logoUrl: Runtime.App.AppConfig.app.logoUrl,
    loginUrl: config.outerHost
  })
}

/* router.get('/', function (req, res, next) {
  if (Runtime.App.AppConfig.app.disableAuthorize) {
    res.redirect('/index')
    return
  }
  res.render('index')
}) */

router.get('/', function (req, res, next) {
  let token = req.query.token
  if (token) {
    Modules.sso.checkAsync(token)
      .then(result => {
        if (result && result.success) {
          SessionStore.setXAuthToken(req, token)
          SessionStore.setUserId(req, token)
          SessionStore.setUserName(req, result.data.user ? result.data.user.name : '')
          SessionStore.setUserInfo(req, result.data.user)
        } else {
          SessionStore.clearSession(req)
          req.session.cookie.maxAge = 0
        }
        let url = ''
        if (Object.keys(req.query).length > 1) {
          url = req.url.replace('token=' + token, '')
        } else {
          url = req.url.replace('?token=' + token, '')
        }
        res.redirect(url)
      })
  } else {
    renderIndex(res)
  }
})

module.exports = router
