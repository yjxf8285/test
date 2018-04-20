export default {
  // 页面加载分析
  getWebPageLoad: {
    url: '/server/v2/web/base/pageLoad'
  },
  // 用户满意度分析
  getWebApdex: {
    url: '/server/v2/web/base/apdex'
  },
  // 浏览器分析
  getWebBrowser: {
    url: '/server/v2/web/base/browser'
  },
  // 访问量
  getWebBasepv: {
    url: '/server/v2/web/base/pv'
  },
  // top5访问量
  getWebTop5pv: {
    url: '/server/v2/web/base/top5/pv'
  },
  // top5耗时
  getWebTop5TimeSpend: {
    url: '/server/v2/web/base/top5/timeSpend'
  },
  // ajax数量
  getWebAjaxPv: {
    url: '/server/v2/web/ajax/pv'
  },
  // ajax时间
  getWebAjaxTime: {
    url: '/server/v2/web/ajax/time'
  }
}
