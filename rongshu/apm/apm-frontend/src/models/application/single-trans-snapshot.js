/*
 * @Author: jiangfeng
 * @Date: 2017-10-29 11:27:37
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2018-01-08 15:06:46
 */

export default {
  // 获取单次快照的基本信息[OK]
  getSingleTransInfo: {
    url: '/server/v2/transaction/snapshot/basic-info'
  },
  // 获取单次事务的潜在风险列表[OK]
  getSingleTransDangers: {
    url: '/server/v2/transaction/snapshot/slow-component'
  },
  // 获取单次组件的远程调用调用列表信息[OK]
  getSingleTransTopoList: {
    url: '/server/v2/transaction/snapshot/topology-info'
  },
  // 获取单次事务的错误列表信息[OK]
  getSingleTransErrorList: {
    url: '/server/v2/transaction/snapshot/error-list'
  },
  // 获取单次事务的数据库&远程调用信息[OK]
  getSingleTransDatabaseRemoteDataList: {
    url: '/server/v2/transaction/snapshot/database-rpc'
  },
  // 获取单次事务的数据库&远程调用信息[OK]
  getSingleTransRemoteWaterfall: {
    url: '/server/v2/transaction/snapshot/waterfall'
  },
  // 获取单次组件调用的概览信息
  getComponentSnapshotOverview: {
    url: '/server/v2/transaction/snapshot/instance/overview'
  },
  // 获取单次组件调用详情信息[OK]
  getComponentSnapshotDetail: {
    url: '/server/v2/transaction/snapshot/instance/components'
  },
  // 获取单次组件调用堆栈追踪详情信息
  getComponentSnapshotStacks: {
    url: '/server/v2/transaction/snapshot/instance/stacks'
  },
  // 获取单次组件的错误列表信息[OK]
  getSingleComponentErrorList: {
    url: '/server/v2/transaction/snapshot/instance/error-info'
  },
  // 获取单次组件的数据库调用列表信息[OK]
  getSingleComponentDataBaseList: {
    url: '/server/v2/transaction/snapshot/instance/database'
  },
  // 获取单次组件的远程调用调用列表信息[OK]
  getSingleComponentRemoteList: {
    url: '/server/v2/transaction/snapshot/instance/remote'
  },
  // 获取单次事务拓扑节点请求数据
  getSingleTransTopoNodeList: {
    url: '/server/v2/transaction/snapshot/request-list'
  }
}
