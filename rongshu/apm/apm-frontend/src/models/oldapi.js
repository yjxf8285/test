export default {
  geApdexData: {
    url: '/agent/sys/apdex'
  },
  getAppList: {
    url: '/agent/sys/applicationList'
  },
  // 根据groupConfig（tierId）获取agent（instance）列表
  getInstances: {
    url: '/agent/listInstanceByTierId',
    method: 'GET'
  },
  getAlarmList: {
    url: '/alarm/trace/list'
  },
  getAllSystemGroupList: {
    url: '/agent/listAllSystemGroupConfigRelation',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  createSystemConfig: {
    url: '/agent/createSystemConfig',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getListSystemConfig: {
    url: '/agent/listAllSystemConfig',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  deleteSystemConfig: {
    url: '/agent/deleteSystemConfig',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  createGroupConfig: {
    url: '/agent/createGroupConfig',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getGroupList: {
    url: '/agent/listGroupConfigBySystemConfigId',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  deleteGroupConfig: {
    url: '/agent/deleteGroupConfig',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  createAgentConfig: {
    url: '/agent/createAgentConfig',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getProbeList: {
    url: '/agent/listAgentConfigBySystemGroupConfigRelation',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getSetProbe: {
    url: '/agent/getAgentConfigurationViewByAgentConfigId',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getSetThreshold: {
    url: '/agent/listThresholdAlgorithmByAgentConfigId',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getSetAlarm: {
    url: '/agent/getNotificationConfigByAgentConfigId',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  getDefaultSetProbe: {
    url: '/agent/listDefaultAgentConfiguration',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  },
  saveAgentConfiguration: {
    url: '/agent/updateAgentConfiguration'
  },
  getAgentConfigType: {
    url: '/agent/listAgentConfigType'
  },
  getWebAffair: {
    url: '/report/webTransaction'
  },
  getPivotalWebAffair: {
    url: '/report/webCriticalTransaction'
  },
  getDataBase: {
    url: '/report/dataBase'
  }
}
