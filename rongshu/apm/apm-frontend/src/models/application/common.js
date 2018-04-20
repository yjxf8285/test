/**
 * Created by liuxiaofan on 2017/8/1.
 */
export default {
  getMock: {
    url: '/static/mock/syslist.json',
    method: 'get',
    __ignoreGlobalApiRoot: true
  },
  // 时间下拉框
  getSysTime: {
    url: '/server/v2/application/time',
    type: 'get'
  },
  // 系统、Tier、应用下拉框
  getSysList: {
    url: '/agent/listAllSystemGroupAgentConfigRelation'
  },
  saveSysInfo: {
    url: '/saveSysInfo',
    type: 'post'
  }
}
