let deepAssign = require('deep-assign')
let baseConfig = require('../../../app.config/app.config')
let AppConfig = require('../../../app.config/app.config' + (process.env.NODE_ENV ? ('.' + process.env.NODE_ENV) : '.development'))
let config = deepAssign({}, baseConfig, AppConfig)
module.exports = config
