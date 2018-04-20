/**
 * Created by liuxiaofan on 2017/8/25.
 */
import appComModel from './common'
import appKeyTransactionModel from './key-transaction'
import appWebTransactionModel from './web-transaction'
import singleTransSnapshotModel from './single-trans-snapshot'
import appTuxedoModel from './tuxedo'
import appTierModel from './tier'
import appBrowserModel from './browser'
import Transaction from './transaction'
import Dashboard from './dashboard'
import Remote from './remote'
import Error from './error'
import Database from './database'
import Jvm from './jvm'
import Threaddump from './threaddump'
const app = {
  // 获取应用概览
  getAppOverview: {
    url: '/server/v2/application/overview'
  },
  // 获取仪表盘拓扑图
  getdashboardtopology: {
    url: '/server/v2/application/dashboard/topology-graph'
  },
  // 获取事务拓扑图
  getsecondtopology: {
    url: '/server/v2/transaction/second-topology'
  }
}
export default [
  app,
  Jvm,
  Dashboard,
  appComModel,
  Transaction,
  appKeyTransactionModel,
  appWebTransactionModel,
  appTuxedoModel,
  appTierModel,
  appBrowserModel,
  singleTransSnapshotModel,
  Remote,
  Error,
  Database,
  Threaddump
]
