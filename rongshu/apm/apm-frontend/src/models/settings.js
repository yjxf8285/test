export default {
  getApplicationList: {
    url: '/agent/listAllApplication',
    method: 'GET'
  },
  createApplication: {
    url: '/agent/createApplication'
  },
  getAppConf: {
    url: '/agent/listApplicationConfigurationByApplicationId',
    method: 'GET'
  },
  getAppConfByIdAndType: {
    url: '/agent/listApplicationConfigurationByApplicationIdAndType',
    method: 'GET'
  },
  updateAppConf: {
    url: '/agent/updateApplicationConfiguration',
    method: 'POST'
  },
  createTier: {
    url: '/agent/createTier',
    method: 'POST'
  },
  updateTierName: {
    url: '/agent/updateTierName',
    method: 'POST'
  },
  deleteTier: {
    url: '/agent/deleteById',
    method: 'POST'
  },
  getTierListByApplicationId: {
    url: '/agent/listTierByApplicationId',
    method: 'GET'
  },
  getInstanceList: {
    url: '/agent/listInstanceByTierId',
    method: 'GET'
  },
  updateInstanceEnabled: {
    url: '/agent/updateInstanceEnabledByInstanceId',
    method: 'POST'
  },
  updateInstanceName: {
    url: '/agent/updateInstanceNameByInstanceId',
    method: 'POST'
  },
  createInstance: {
    url: '/agent/createInstance',
    method: 'POST'
  },
  getInsConfig: {
    url: '/agent/listInstanceConfigurationByInstanceIdAndType',
    method: 'GET'
  },
  updateInsConf: {
    url: '/agent/updateInstanceConfiguration',
    method: 'POST'
  },
  updateMutiInsConf: {
    url: '/agent/batchUpdateConfigurationForTier',
    method: 'POST'
  },
  getTierType: {
    url: '/agent/listTierType',
    method: 'GET'
  },
  getApplicationForApdexT: {
    url: '/agent/getApdexForApp',
    method: 'GET'
  },
  getTransactionListForApdexT: {
    url: '/agent/listTransactionForApdexT',
    method: 'GET'
  },
  getInstanceListForApdexT: {
    url: '/agent/listInstancesWithApdexT',
    method: 'GET'
  },
  updateApdexTForApp: {
    url: '/agent/updateApdexTForApp'
  },
  updateApdexTForInstance: {
    url: '/agent/updateApdexTForInstance'
  },
  updateApdexTForTransaction: {
    url: '/agent/updateApdexTForTransaction'
  },
  getAgentConfigurationValidation: {
    url: '/agent/getAgentConfigurationValidation',
    method: 'GET'
  },
  getWebBrowserAgent: {
    url: '/agent/existWebAgent',
    method: 'GET'
  },
  createWebAgent: {
    url: '/agent/createWebAgent'
  },
  listWebAgentConfiguration: {
    url: '/agent/listWebAgentConfiguration',
    method: 'GET'
  },
  updateWebAgentConfiguration: {
    url: '/agent/updateWebAgentConfiguration'
  },
  getWebAgentFile: {
    url: '/agent/getWebAgentFile'
  },
  listWebAgentConfigurationByAppId: {
    url: '/agent/listWebAgentConfigurationByAppId',
    method: 'GET'
  }
}
