const deepAssign = require('deep-assign')
const base = require('./base')
/**
 * @author: jiangfeng
 * @summary: env test config
 */
module.exports = deepAssign({}, base, {
  remoteHost: 'http://10.200.10.22:28080',
  disableAuthorize: true,
  disableOrmMapping: true,
  disableSession: false,
  disableLog: false,
  disableInternational: true,
  disableGzip: false,
  directory: {
    static: './dist/assets',
    view: './dist/views',
    service: './dist/services',
    router: '',
    module: ''
  },
  listenPort: '6661'
})
