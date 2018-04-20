/**
 * Created by liuxiaofan on 2017/7/20.
 * web事务
 */
export default {
  // WEB事务—第一层 Top5 应用慢事务
  getSpanQueryTop: {
    url: '/webTransaction/top'
  },
  // WEB事务—第一层—Top5 Web事务平均响应时间
  getTopLineChart: {
    url: '/webTransaction/topLineChart'
  },
  // WEB事务—第一层—吞吐量
  getWebTransactionTps: {
    url: '/webTransaction/tps'
  },
  // WEB事务—第一层—平均响应时间
  getWebTransactionAvgResponseTime: {
    url: '/webTransaction/avgResponseTime'
  },
  // WEB事务—第一层—Web事务列表
  getSpanWebTranList: {
    url: '/webTransaction/list'
  },
  // WEB事务—第二层—Web事务各组件平均响应时间
  getAvgResponseTimeFromURI: {
    url: '/webTransaction/avgResponseTimeFromURI'
  },
  // WEB事务—第二层—Web事务分解
  getSpanWebTranDec: {
    url: '/webTransaction/decompositionFromURI'
  },
  // WEB事务—第二层—吞吐量
  getTpsFromURI: {
    url: '/webTransaction/tpsFromURI'
  },
  // WEB事务—第二层—Web事务列表
  getListFromURI: {
    url: '/webTransaction/listFromURI'
  },
  // WEB事务—第三层—SQL调用
  getwebSqlInfo: {
    url: '/webTransaction/sqlInfoFromTrace'
  },
  // WEB事务—第三层—请求详情
  getwebRequestInfo: {
    url: '/webTransaction/requestInfoFromTrace'
  },
  // WEB事务—第三层—追踪详情
  getSpanStack: {
    url: '/webTransaction/stackFromTrace'
  },
  // WEB事务—第三层—组件平均耗时排序
  getComponentsAvg: {
    url: '/webTransaction/componentsAvgTimeFromTrace'
  }
}
