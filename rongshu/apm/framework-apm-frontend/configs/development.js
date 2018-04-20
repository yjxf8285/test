const deepAssign = require('deep-assign')
const base = require('./base')
/**
 * @author: jiangfeng
 * @summary: env test config
 */
module.exports = deepAssign({}, base, {
  webpack: {
    dev: {
      port: 18088
    }
  },
  proxyHost: 'http://10.205.16.162:28082',
  disableAuthorize: false,
  disableOrmMapping: true,
  disableSession: false,
  disableLog: false,
  disableInternational: true,
  disableGzip: false,
  directory: {
    static: './dist/assets',
    view: './dist/views',
    service: './src/backend/services',
    router: '',
    module: './src/backend/modules'
  },
  session: {
    // 默认两天过期
    maxAge: 7200000,
    // 支持memory,redis
    authField: 'userID',
    store: 'redis',
    prefix: 'apm:',
    secret: 'apm',
    name: 'apm',
    // 每个请求都重新设置一个 cookie，默认为 false。
    rolling: true,
    // 即使 session 没有被修改，也保存 session 值，默认为 true。
    resave: true,
    saveUninitialized: true
  },
  redis: {
    mode: 'sentinel',
    prefix: 'apm:',
    local: {
      port: 6379,
      host: '127.0.0.1'
    },
    cluster: [{
      port: 7000,
      host: '10.205.16.162'
    },
    {
      port: 7001,
      host: '10.205.16.162'
    },
    {
      port: 7000,
      host: '10.205.16.163'
    },
    {
      port: 7001,
      host: '10.205.16.163'
    },
    {
      port: 7000,
      host: '10.205.16.164'
    },
    {
      port: 7001,
      host: '10.205.16.164'
    }
    ],
    sentinel: {
      sentinels: [{
        host: '10.205.16.162',
        port: 26001
      },
      {
        host: '10.205.16.163',
        port: 26002
      },
      {
        host: '10.205.16.164',
        port: 26002
      }
      ],
      name: 'mymaster'
    }
  },
  listenPort: '6661',
  sso: {
    host: 'http://10.205.16.162:28082',
    outerHost: 'http://10.205.16.162:28082'
  }
})
