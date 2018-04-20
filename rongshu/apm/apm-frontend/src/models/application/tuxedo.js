/**
 * Created by liuxiaofan on 2017/7/20.
 */
export default {
  // 获取公告板信息
  getBbs: {
    url: '/server/v2/tuxedo/bbs',
    contentType: 'application/json'

  },
  // 获取服务器信息
  getPsr: {
    url: '/server/v2/tuxedo/psr',
    contentType: 'application/json',
    data: {
      v: 1
    }
  },
  // 根据服务信息
  getPsc: {
    url: '/server/v2/tuxedo/psc',
    contentType: 'application/json'
  },
  // 获取队列信息
  getPq: {
    url: '/server/v2/tuxedo/pq',
    contentType: 'application/json'
  },
  // 获取交易信息
  getPclt: {
    url: '/server/v2/tuxedo/pclt',
    contentType: 'application/json'
  },
  // 忙服务器占比
  getBusyServerRate: {
    url: '/server/v2/tuxedo/psr/busyServerRate',
    contentType: 'application/json'
  },
  // 负载
  getPsrLoad: {
    url: '/server/v2/tuxedo/psr/load',
    contentType: 'application/json'
  },
  // 请求
  getPsrRequest: {
    url: '/server/v2/tuxedo/psr/request',
    contentType: 'application/json'
  },
  // 忙客户占比
  getBusyClientRate: {
    url: '/server/v2/tuxedo/pclt/busyClientRate',
    contentType: 'application/json'
  },

  // 交易吞吐量
  gettrade: {
    url: '/server/v2/tuxedo/pclt/trade',
    contentType: 'application/json'
  }

}
