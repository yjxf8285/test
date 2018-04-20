let Runtime = require('../runtime/index')
let SessionStore = Runtime.SessionStore

module.exports = {
  '/api/saveSysInfo': {
    method: 'get',
    mock: false,
    callback: function(req, res, callback) {
      var sysInfo = req.body
      SessionStore.setSysInfoAsync(sysInfo)
      callback({
        code: 0,
        success: true
      })
    }
  }
}
