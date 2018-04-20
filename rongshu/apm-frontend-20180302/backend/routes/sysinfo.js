var express = require('express')
let Runtime = require('../runtime/index')
var router = express.Router()
let SessionStore = Runtime.SessionStore

router.get('/sysinfo', function(req, res, next) {
  SessionStore.setSysInfoAsync(req.query)
  let timeMap = {
    '30m': '&from=now-30m&to=now',
    '1h': '&from=now-1h&to=now',
    '6h': '&from=now-6h&to=now',
    '12h': '&from=now-12h&to=now',
    '1d': '&from=now-24h&to=now',
    '3d': '&from=now-7d&to=now',
    '7d': '&from=now-7d&to=now',
    '14d': '&from=now-30d&to=now',
    '1M': '&from=now-30d&to=now'
  }

  res.redirect(Runtime.App.AppConfig.app.grafana.host + Runtime.App.AppConfig.app.grafana.fullScreenUrl + timeMap[req.query.interval])
})

module.exports = router
