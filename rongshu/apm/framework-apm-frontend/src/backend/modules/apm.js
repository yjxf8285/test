const utils = require('apm-frontend-framework').Utils
module.exports = app => {
  return {
  /**
   * 获取系统应用列表
   */
    getListSystemConfig () {
      return utils.httpClient.get({
        host: app.config.proxyHost,
        url: '/agent/listAllSystemConfig'
      })
    },
    /**
   * 创建web探针
   * @param applicationName 探针名称
   */
    createWebAgent (name, description) {
      return utils.httpClient.get({
        host: app.config.proxyHost,
        url: '/agent/createWebAgent',
        query: {
          name: name,
          description: encodeURIComponent(description)
        }
      })
    },
    getAppAgentConfig (applicationId, type) {
      return utils.httpClient.get({
        host: app.config.proxyHost,
        url: '/agent/listApplicationConfigurationByApplicationIdAndType',
        query: {
          applicationId: applicationId,
          type: type
        }
      }).then(res => {
        let appConfig = {}
        if (res.data && res.data instanceof Array) {
          res.data.forEach(item => {
            appConfig[item.key] = item.value
          })
          res.data = appConfig
        }
        return res
      })
    },
    getWebAgentConfig (applicationId) {
      return utils.httpClient.get({
        host: app.config.proxyHost,
        url: '/agent/getBrowserInstanceByApplicationId',
        query: {
          applicationId: applicationId
        }
      })
    },
    /**
   * 更新应用配置
   * @param queryData
   */
    updateApplicationConfiguration (queryData) {
      return utils.httpClient.post({
        host: app.config.proxyHost,
        url: '/agent/updateApplicationConfiguration',
        body: queryData
      })
    }
  }
}
