module.exports = app => {
  return {
    '/api/agent/getWebAgentFile': {
      method: 'post',
      request: (request, response, callback) => {
        let config = request.body
        app.modules.sdk.renderFiles(config.appName, {
          showLog: config.showLog,
          openTracing: config.openTracing,
          transFrequency: config.transFrequency,
          apiHost: 'http://' + config.host + ':' + config.port,
          agentId: config.agentId,
          appId: config.applicationId
        })
        callback({
          code: 0,
          success: true,
          data: null
        })
      }
    }
  }
}
