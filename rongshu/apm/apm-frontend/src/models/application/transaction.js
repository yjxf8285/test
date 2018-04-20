/**
 * Created by liuxiaofan on 2017/11/9.
 * 事务相关接口
 */
export default {
  // 获取事务分类概览信息
  getFilterSummary: {
    url: '/server/v2/transaction/filter-summary'
  },
  // web事物-列表
  getSummaries: {
    url: '/server/v2/transaction/summaries'
  },
  // 获取事务概览信息
  getPerformanceSummaries: {
    url: '/server/v2/transaction/diagram/performance-summary'

  },
  // 事务TopN慢组件信息接口
  getTransactiondiagramtopNcomponents: {
    url: '/server/v2/transaction/diagram/topN-components'

  },
  // 特定组件时间贡献值接口
  getTransactiondiagramtimecontributed: {
    url: '/server/v2/transaction/diagram/time-contributed'

  },
  // 特定组件的topN次执行事务接口
  getTransactiondiagramtopNcalls: {
    url: '/server/v2/transaction/diagram/topN-calls'

  },
  // 事务快照列表接口
  getTransactionsnaplist: {
    url: '/server/v2/transaction/snap/snap-list'

  },
  // 事务快照列表接口
  getTransactionsnapsections: {
    url: '/server/v2/transaction/snap/sections'

  },
  // 单类事务-图表（直方图
  getTransactiondiagramreqcountsummary: {
    url: '/server/v2/transaction/diagram/reqcount-summary'

  },
  // 单类事务-图表（分类图）
  getTransactiondiagramreqcountsectionsummary: {
    url: '/server/v2/transaction/diagram/reqcountsection-summary'

  },
  // 单类事务-图表（错误饼图
  getTransactionerrorsummary: {
    url: '/server/v2/transaction/diagram/errorsummary-top5'

  }

}
