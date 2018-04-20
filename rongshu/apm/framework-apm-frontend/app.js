let Framework = require('apm-frontend-framework')
module.exports = (env = 'development') => {
  let config = require('./configs/' + env)
  return Framework.createInstance(config, __dirname, true)
}
