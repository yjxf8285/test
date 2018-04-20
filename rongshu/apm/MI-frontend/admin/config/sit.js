/**
 * @author: jiangfeng
 * @summary: SIT环境的配置文件
 */
module.exports = {
  'app': {
    'remoteHost': 'http://10.205.16.184:28083',
    'alarmRemoteHost': 'http://10.200.3.133:38092',
    'alarmHost': 'http://10.200.3.133:18090',
    'grafana': {
      'host': 'http://10.200.2.120:3000',
      'fullScreenUrl': '/dashboard/db/apm-test?orgId=1',
      'login': '/login?sso=true'
    },
    'disableAuthorize': true
  },
  'runtime': {
    'listenPort': '18080',
    'session': {
      'maxAge': 7200000,
      'store': 'redis'
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
        'host': '10.205.16.184'
      }, {
        'port': 7001,
        'host': '10.205.16.185'
      }, {
        'port': 7000,
        'host': '10.205.16.186'
      }]
    },
    'sso': {
      'host': 'http://10.205.16.184:28088',
      'md5': '6ca89616f12a41808b1c17b296bead8a'
    }
  }
}
