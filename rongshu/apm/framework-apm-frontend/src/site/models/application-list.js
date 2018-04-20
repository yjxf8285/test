export default {
  getApplicationsOverview: { // 应用列表页需要额外健康度（容忍度）数据
    url: '/server/v2/application/overview',
    method: 'get'
  },
  getApplications: { // 应用选择器中的接口仅需要id和name属性即可
    url: '/agent/listAllSystemConfig',
    method: 'get'
  }
}
