/**
 * Created by liuxiaofan on 2017/8/22.
 * 设置相关接口
 */
const modules = require('../modules')
module.exports = {
  /**
   * 应用列表
   * tier数量-1
   */
  '/agent/listAllApplication': (request, response, responseData) => {
    // let applicationHierarchy = responseData.data.applicationHierarchy
    // applicationHierarchy.map(m => {
    //   m.tierTotal > 0 ? m.tierTotal-- : m.tierTotal = 0
    // })
  },

  // 创建web探针
  '/api/agent/createWebAgent': {
    method: 'get',
    mock: false,
    callback: (request, response, callback) => {
      let queryData = request.query
      let name = queryData.name || ''
      let description = queryData.description || ''
      modules.apm.createWebAgent(name, description).then(res => {
        if (res.code === 0) {
          Promise.all([
            modules.apm.getAppAgentConfig(res.data.applicationId, modules.common.AppTypeEnum.BROWSER),
            modules.apm.getWebAgentConfig(res.data.applicationId)
          ])
            .then(result => {
              let appConfig = result[0].data
              let webConfig = result[1].data
              modules.sdk.renderFiles(name, {
                showLog: appConfig['kepler.browser.showlog'],
                openTracing: appConfig['kepler.browser.openTraceEnabled'],
                transFrequency: appConfig['kepler.browser.transFrequency'],
                apiHost: 'http://' + appConfig['kepler.agent.collector.host'] + ':' + appConfig['kepler.agent.collector.port'],
                agentId: webConfig.token,
                tierId: '',
                appId: res.data.applicationId
              })
              callback(res)
            })
        } else {
          callback(res)
        }
      })
    }
  },
  // 更新应用配置
  '/api/agent/updateApplicationConfiguration': {
    method: 'post',
    mock: false,
    callback: (request, response, callback) => {
      let queryData = request.body
      let name = queryData.applicationName || ''
      var applicationId = queryData.configurations[0].applicationId
      // 新更新应用设置
      // 再次更新SDK
      modules.apm.updateApplicationConfiguration(queryData).then(res => {
        if (res.code === 0) {
          Promise.all([
            modules.apm.getAppAgentConfig(applicationId, modules.common.AppTypeEnum.BROWSER),
            modules.apm.getWebAgentConfig(applicationId)
          ])
            .then(result => {
              if (!result[1].data) callback('错误！！！node端更新SDK时调用的getWebAgentConfig方法未能获取到数据（data:null）')
              let appConfig = result[0].data
              let webConfig = result[1].data
              modules.sdk.renderFiles(name, {
                showLog: appConfig['kepler.browser.showlog'],
                openTracing: appConfig['kepler.browser.openTraceEnabled'],
                transFrequency: appConfig['kepler.browser.transFrequency'],
                apiHost: 'http://' + appConfig['kepler.agent.collector.host'] + ':' + appConfig['kepler.agent.collector.port'],
                agentId: webConfig.token, // todo 这里要不要给个默认的token？
                tierId: '',
                appId: applicationId
              })
              callback(res)
            })
        } else {
          callback(res)
        }
      })
    }
  }
}
