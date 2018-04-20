/**
 * @author: jiangfeng
 * @summary: 开发环境的配置文件
 */
module.exports = {
  'app': {
    'remoteHost': 'http://10.205.16.118:28083/',
    'alarmRemoteHost': 'http://10.200.3.133:8092',
    'alarmHost': 'http://10.200.3.133:8888',
    'grafana': {
      'host': 'http://10.200.0.65:81',
      'fullScreenUrl': '/dashboard/db/new-dashboard-copy?orgId=2',
      'login': '/login?sso=true'
    },
    'staticSrc': './src/',
    'renderView': './views/'
  },
  'runtime': {
    'listenPort': '9092',
    'session': {
      'maxAge': 7200000,
      'store': 'memory',
      'prefix': 'apm:',
      'secret': 'apm',
      'name': 'apm'
    },
    'log4js': {
      'customBaseDir': './logs/',
      'customDefaultAtt': {
        'type': 'dateFile',
        'absolute': false,
        'alwaysIncludePattern': true
      }
    },
    'redis': {
      'mode': 'cluster',
      'local': {
        'port': 6379,
        'host': '127.0.0.1'
      },
      'cluster': [{
        'port': 7000,
        'host': '10.200.10.36'
      }, {
        'port': 7001,
        'host': '10.200.10.36'
      }, {
        'port': 7000,
        'host': '10.200.10.37'
      }]
    },
    'sso': {
      'host': 'http://10.200.10.22:18001',
      'md5': '6ca89616f12a41808b1c17b296bead8a'
    }
  }
}
