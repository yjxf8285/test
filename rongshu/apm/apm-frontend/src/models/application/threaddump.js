export default {
  // threaddump
  // 获取线程剖析列表
  getThreaddumpList: {
    url: '/server/v2/agent/threaddump/list'
  },
  // 开始剖析
  startAnalysis: {
    url: '/server/v2/agent/threaddump/create'
  },
  cancelAnalysis: {
    url: '/server/v2/agent/threaddump/cancel'
  },
  deleteAnalysis: {
    url: '/server/v2/agent/threaddump/delete'
  },
  // 获取剖析报告
  getThreaddumpAnalysisReport: {
    url: '/server/v2/agent/threaddump/getById'
  }
}
