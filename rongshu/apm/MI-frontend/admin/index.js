#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var config = require('./runtime/App/AppConfig')
var app = require('./app')
var debug = require('debug')('apm')
var http = require('http')

// 404错误处理
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  var warning = '404 Not Found,originalUrl:' + req.originalUrl
  app.logger.warn(warning)
  err.status = 404
  next()
})

// 开发环境错误提示
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    app.logger.error(err.message)
    res.end('error:' + err + ',message:' + err.message)
    next()
  })
} else {
  // 生产环境错误提示
  app.use(function (err, req, res, next) {
    res.status(req.status || 500)
    app.logger.error(err)
    res.render('error', {
      message: err.message,
      error: {}
    })
    next()
  })
}
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(config.runtime.listenPort || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */
var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
console.log(process.env.NODE_ENV + ' is running , port : ' + port)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

process.on('uncaughtException', function (err) {
  console.error('uncaughtException: %s', err.message)
  var worker = require('cluster').worker
  if (worker) {
    process.send({
      cmd: 'suicide',
      crash: err.stack,
      message: err.message
    })
    server.close(function () {
      process.exit(1)
    })
  }
})
