/**
 * Created by liuxiaofan on 2017/12/4.
 */
export default {
  // 应用环境
  getAppEnvironment: {
    url: '/server/v2/application/applicationEnvironment'
  },
  getJrockitHeapusedData: {
    url: '/server/v2/jvm/jrockit/heapUsed'
  },
  getjrockitunHeapUsedData: {
    url: '/server/v2/jvm/jrockit/noheapUsed'
  },
  getnurseryData: {
    url: '/server/v2/jvm/jrockit/nursery'
  },
  getjrockitoldSpaceData: {
    url: '/server/v2/jvm/jrockit/oldspace'
  },
  getclassMemoryData: {
    url: '/server/v2/jvm/classMemory'
  },
  // 堆使用情况
  getHeapUsedData: {
    url: '/server/v2/jvm/heapUsed'
  },
  // Eden space使用情况
  getEdenSpaceLineData: {
    url: '/server/v2/jvm/edenSpace'
  },
  // Survivor Space
  getSurvivorSpaceLineData: {
    url: '/server/v2/jvm/survivorSpace'
  },
  // Old Gen
  getOldGenData: {
    url: '/server/v2/jvm/oldGen'
  },
  // Perm Gen
  getPermGenData: {
    url: '/server/v2/jvm/permGen'
  },
  // Meta Space
  getMetaSpaceData: {
    url: '/server/v2/jvm/metaspace'
  },
  /* new GC */
  getNewGcTimeData: {
    url: '/server/v2/jvm/newGC'
  },
  /* old GC */
  getOldGcTimeData: {
    url: '/server/v2/jvm/oldGC'
  },
  getCodeCacheData: {
    url: '/server/v2/jvm/codeCache'
  },
  getClassCountData: {
    url: '/server/v2/jvm/classCount'
  },
  getThreadCountData: {
    url: '/server/v2/jvm/threadCount'
  },
  getclassBlockMemoryData: {
    url: '/server/v2/jvm/classBlockMemory'
  }
}
