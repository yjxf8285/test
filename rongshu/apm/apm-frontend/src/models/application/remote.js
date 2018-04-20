export default {
  getRemoteList: {
    url: '/server/v2/remote/list'
  },
  getRemoteInitiators: {
    url: '/server/v2/component/listRefinedSpanCallers'
  },
  getRemoteErrorTypes: {
    url: '/server/v2/component/listRefinedSpanErrorTypes'
  },
  getThroughputAndTimeTrend: {
    url: '/server/v2/remote/throughput-and-time-trend'
  },
  getInvokerElapsedTimePercentage: {
    url: '/server/v2/remote/caller-elapsed-time-percentage'
  },
  getInvokerList: {
    url: '/server/v2/remote/caller-list'
  },
  getRemoteErrorSectionsData: {
    url: '/server/v2/remote/summary/error/errorcount'
  },
  getRemoteErrorTopNData: {
    url: '/server/v2/remote/summary/error/errorcount-type'
  },
  getRemoteErrorcountPercentage: {
    url: '/server/v2/remote/summary/error/errorcount-percentage'
  },
  getRemoteSnapshotList: {
    url: '/server/v2/remote/snapshot'
  }
}
