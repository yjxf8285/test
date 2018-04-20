var express = require('express')
var router = express.Router()

router.get('/i18n', function(req, res, next) {
  var lang = 'zh-CN'
  res.cookie('lang', lang, {
    maxAge: 1000 * 3600 * 24 * 7,
    httpOnly: true
  })
  res.setLocale(lang)
  res.render('i18n')
})

module.exports = router
