/**
 * @author jiangfeng
 * @summary 用户SSO登录模块
 */
let Runtime = require('../runtime')
let SessionStore = Runtime.SessionStore
let AppConfig = Runtime.App.AppConfig
var log = Runtime.App.Log.helper

function loginAsync(username, password) {
  let httpClient = new Runtime.App.HttpClient({
    httpHost: AppConfig.runtime.sso.host,
    urlPath: '/sso/login',
    formData: {
      user: username,
      password: password
    }
  })
  return httpClient
    .post()
}

function logoutAsync(ticket) {
  let httpClient = new Runtime.App.HttpClient({
    httpHost: AppConfig.runtime.sso.host,
    urlPath: '/sso/logout',
    formData: {
      ticket: ticket
    }
  })
  return httpClient
    .post()
}

function checkAsync(ticket) {
  let httpClient = new Runtime.App.HttpClient({
    httpHost: AppConfig.runtime.sso.host,
    urlPath: '/sso/check',
    formData: {
      ticket: ticket,
      url: ''
    }
  })
  return httpClient
    .post()
}

module.exports = {
  loginAsync,
  logoutAsync,
  checkAsync
}
