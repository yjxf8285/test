'use strict';

module.exports = {
  name: 'thinkjs',
  type: 'file',
  secret: '`^S2~*8L',
  timeout: 24 * 3600,
  cookie: { // cookie options
    length: 32,
    httponly: true
  },
  adapter: {
    file: {
      path: think.RUNTIME_PATH + '/session',
    }
  }
}