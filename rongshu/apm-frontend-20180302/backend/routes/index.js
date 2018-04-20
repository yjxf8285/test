var express = require('express')
const URL = require('url')
let Runtime = require('../runtime')
var router = express.Router()
let config = Runtime.App.AppConfig.runtime.sso

let SessionStore = Runtime.SessionStore

let Modules = require('../modules')

router.get('/*', function(req, res, next) {
  let lang = req.query.lang || 'zh-CN'
  res.cookie('lang', lang, {
    maxAge: 1000 * 3600 * 24 * 7,
    httpOnly: true
  })
  res.setLocale(lang)
  next()
})

function renderIndex(res, token) {
  res.render('index', {
    env: process.env.NODE_ENV,
    logoUrl: Runtime.App.AppConfig.app.logoUrl,
    loginUrl: config.outerHost,
    outerRemoteHost: Runtime.App.AppConfig.app.outerRemoteHost,
    alarmHost: Runtime.App.AppConfig.app.alarmHost,
    grafanaLoginUrl: Runtime.App.AppConfig.app.grafana.host + Runtime.App.AppConfig.app.grafana.login,
    grafanafullScreenUrl: Runtime.App.AppConfig.app.grafana.host + Runtime.App.AppConfig.app.grafana.fullScreenUrl,
    webAgent: Runtime.App.AppConfig.app.webAgent
  })
}

function redirectUrl(req, res, token) {
  let url = ''
  if (Object.keys(req.query).length > 1) {
    url = req.url.replace('token=' + token, '')
  } else {
    url = req.url.replace('?token=' + token, '')
  }
  res.redirect(url)
}
/* eslint-disable no-unused-vars */
function redirectToLogin(req, res) {
  let protocol = req.protocol
  let host = req.headers.host
  let url = req.url
  let redirectUrl = encodeURIComponent(`${protocol}://${host}${url}`)
  let loginUrl = URL.parse(Runtime.App.AppConfig.runtime.pages.loginUrl)
  loginUrl.search = loginUrl.search && loginUrl.search.length > 0 ? `${loginUrl.search}&redirectUrl=${redirectUrl}` : `?redirectUrl=${redirectUrl}`
  res.redirect(URL.format(loginUrl))
}

router.get('/', function(req, res, next) {
  let token = req.query.token
  if (token) {
    Modules.sso.checkAsync(token)
      .then(result => {
        if (result && result.success) {
          SessionStore.setXAuthToken(req, token)
          SessionStore.setUserId(req, token)
          SessionStore.setUserName(req, result.data.user ? result.data.user.name : '')
          SessionStore.setUserInfo(req, result.data.user)
          return redirectUrl(req, res, token)
        } else {
          SessionStore.clearSession(req)
          req.session.cookie.maxAge = 0
          // return redirectToLogin(req, res)
        }
        renderIndex(res)
      })
  } else {
    /* token = SessionStore.getXAuthToken(req)
    if (!token) {
      return redirectToLogin(req, res)
    } */
    renderIndex(res)
  }
})

module.exports = router
