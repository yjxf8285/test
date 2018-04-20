/**
 * Created by liuxiaofan on 2017/7/20.
 * 数据库
 */
export default {
  // 调用者列表
  getlistRefinedSpanCallers: {
    url: '/server/v2/component/listRefinedSpanCallers'
  },
  // 数据库实例
  getlistRefinedSpanDatabaseInstance: {
    url: '/server/v2/component/listRefinedSpanDatabaseInstance'
  },
  // 数据库实例的topN
  getDatabasetopn: {
    url: '/server/v2/database/topn'
  },
  // 数据库趋势图
  getDatabaseTrend: {
    url: '/server/v2/application/database/trend'
  },
  // 获取SQL快照列表
  getDatabasesnapshotSqlList: {
    url: '/server/v2/database/snapshot/sql/list'
  },
  // 数据库访问的响应时间序列统计柱状图
  getDatabasesdiagramSectionSummary: {
    url: '/server/v2/database/diagram/responsetime-section-summary'
  }

}
