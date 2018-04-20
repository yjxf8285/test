/**
 * Created by liuxiaofan on 2017/8/22.
 * 所有调apm后端java接口的方法集合
 */
const Runtime = require('../runtime/index')
const config = Runtime.App.AppConfig.app
module.exports = {
  /**
   * 获取系统应用列表
   */
  getListSystemConfig() {
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.remoteHost,
      urlPath: '/agent/listAllSystemConfig',
      queryParams: {}
    })
    return httpClient
      .get()
  },
  /**
   * 创建web探针
   * @param applicationName 探针名称
   */
  createWebAgent(name, description) {
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.remoteHost,
      urlPath: '/agent/createWebAgent',
      queryParams: {
        name: name,
        description: encodeURIComponent(description)
      }
    })
    return httpClient
      .get()
  },
  getAppAgentConfig(applicationId, type) {
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.remoteHost,
      urlPath: '/agent/listApplicationConfigurationByApplicationIdAndType',
      queryParams: {
        applicationId: applicationId,
        type: type
      }
    })
    return httpClient
      .get().then(res => {
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
  getWebAgentConfig(applicationId) {
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.remoteHost,
      urlPath: '/agent/getBrowserInstanceByApplicationId',
      queryParams: {
        applicationId: applicationId
      }
    })
    return httpClient
      .get()
  },
  /**
   * 更新应用配置
   * @param queryData
   */
  updateApplicationConfiguration(queryData) {
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.remoteHost,
      urlPath: '/agent/updateApplicationConfiguration',
      formData: queryData
    })
    return httpClient
      .post()
  }
}
