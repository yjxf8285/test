/* eslint-disable no-useless-escape */
let Runtime = require('../runtime/index')
module.exports = {
  '/api/*': {
    method: 'all',
    mock: {
      on: false
    },
    callback: function(req, res, callback) {
      let method = req.method.toLowerCase() || 'get'
      let regExp = new RegExp('^\/api(.+)')
      let results = regExp.exec(req.url)
      let url = ''
      if (results === null || (results && typeof (results[1]) !== 'string' && results[1].length)) {
        url = ''
      } else {
        // url = decodeURIComponent(results[1]).replace(/\+/g, ' ');
        url = results[1].replace(/\+/g, ' ')
      }

      let params = {
        req: req,
        res: res,
        urlPath: url
      }

      if (method === 'post') {
        params.formData = req.body
      }

      var httpClient = new Runtime.App.HttpClient(params)

      httpClient[method]()
      .then(function(responseData) {
        callback(responseData)
      })
    }
  }
}
