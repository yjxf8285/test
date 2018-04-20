<style lang="scss" scoped>
  .table-box {
    position: relative;
  }
  .pag-wrap {
    text-align: right;
  }
</style>

<template>
  <div>
    <top-bar :title="'Tuxedo'" @barChange="barChange"></top-bar>
    <tuxedo-bar></tuxedo-bar>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">公告板</span>
      </div>
      <div class="content">
        <el-table :data="currenTime.callBoard" stripe :show-header="false" >
          <el-table-column prop="key" label="" align="center"></el-table-column>
          <el-table-column prop="value" label="" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">服务器信息</span>
      </div>
      <div class="content">
        <div class="table-box" ref="loadingInstance_serverInfo">
          <el-table :data="currenTime.serverInfo" stripe style="width: 100%" class="mt20">
            <el-table-column prop="progName" label="Prog Name"></el-table-column>
            <el-table-column prop="queueName" label="Queue Name"></el-table-column>
            <el-table-column prop="groupName" label="Grp Name"></el-table-column>
            <el-table-column prop="serverId" label="ID"></el-table-column>
            <el-table-column prop="requestDone" label="RqDone"></el-table-column>
            <el-table-column prop="loadDone" label="Load Done"></el-table-column>
            <el-table-column prop="serverStatus" label="Current Service"></el-table-column>
          </el-table>
          <div class="pag-wrap">
            <el-pagination v-show="total.serverInfo > 0" layout="total, prev, pager, next" @current-change="serverInfoHandleCurrentChange" :page-size="pageSize" :current-page="currentPage.serverInfo" :total="total.serverInfo">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">交易信息</span>
      </div>
      <div class="content">
        <div class="table-box" ref="loadingInstance_tradeInfo">
          <el-table :data="currenTime.tradeInfo" stripe style="width: 100%" class="mt20">
            <el-table-column prop="lmId" label="LMID"></el-table-column>
            <el-table-column prop="userName" label="User Name"></el-table-column>
            <el-table-column prop="clientName" label="Client Name"></el-table-column>
            <el-table-column prop="linkTime" label="Time Status"></el-table-column>
            <el-table-column prop="bca" label="Bgn/Cmmt/Abrt"></el-table-column>
            <el-table-column prop="status" label="Status"></el-table-column>
          </el-table>
          <div class="pag-wrap">
            <el-pagination v-show="total.tradeInfo > 0" layout="total, prev, pager, next" @current-change="tradeInfoHandleCurrentChange" :page-size="pageSize" :current-page="currentPage.tradeInfo" :total="total.tradeInfo">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">服务信息</span>
      </div>
      <div class="content">
        <div class="table-box" ref="loadingInstance_serviceInfo">
          <el-table :data="currenTime.serviceInfo" stripe style="width: 100%" class="mt20">
            <el-table-column prop="serviceName" label="Service Name"></el-table-column>
            <el-table-column prop="routeName" label="Routine Name"></el-table-column>
            <el-table-column prop="progName" label="Prog Name"></el-table-column>
            <el-table-column prop="groupName" label="Grp Name"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="machineId" label="Machine"></el-table-column>
            <el-table-column prop="callCt" label="# Done"></el-table-column>
            <el-table-column prop="serviceStatus" label="Status"></el-table-column>
          </el-table>
          <div class="pag-wrap">
            <el-pagination v-show="total.serviceInfo > 0" layout="total, prev, pager, next" @current-change="serviceInfoHandleCurrentChange" :page-size="pageSize" :current-page="currentPage.serviceInfo" :total="total.serviceInfo">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">队列信息</span>
      </div>
      <div class="content">
        <div class="table-box" ref="loadingInstance_queueInfo">
          <el-table :data="currenTime.queueInfo" stripe style="width: 100%" class="mt20">
            <el-table-column prop="progName" label="Prog Name"></el-table-column>
            <el-table-column prop="queueName" label="Queue Name"></el-table-column>
            <el-table-column prop="serverCt" label="# Server"></el-table-column>
            <el-table-column prop="wkCt" label="Wk Queued"></el-table-column>
            <el-table-column prop="queuedCt" label="# Queued"></el-table-column>
            <el-table-column prop="avgLength" label="Ave. Len"></el-table-column>
            <el-table-column prop="machineId" label="Machine"></el-table-column>
          </el-table>
          <div class="pag-wrap">
            <el-pagination v-show="total.queueInfo > 0" layout="total, prev, pager, next" @current-change="queueInfoHandleCurrentChange" :page-size="pageSize" :current-page="currentPage.queueInfo" :total="total.queueInfo">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tuxedoBar from '@/components/layout/tuxedo-bar.vue'
  import {
    Table,
    TableColumn,
    Button,
    Loading,
    Pagination
  } from 'element-ui'
  import topBarQuery from '@/components/mixin/topBarQuery'
  export default {
    mixins: [topBarQuery],
    data() {
      return {
        queryData: {},
        currenTime: {
          callBoard: [],
          serverInfo: [],
          tradeInfo: [],
          serviceInfo: [],
          queueInfo: []
        },
        currentPage: {
          serverInfo: 1,
          tradeInfo: 1,
          serviceInfo: 1,
          queueInfo: 1
        },
        total: {
          serverInfo: 10,
          tradeInfo: 10,
          serviceInfo: 10,
          queueInfo: 10
        },
        pageSize: 10,
        loading: {
          serverInfo: false,
          tradeInfo: false,
          serviceInfo: false,
          queueInfo: false
        },
        loadingInstance: {
          serverInfo: null,
          tradeInfo: null,
          serviceInfo: null,
          queueInfo: null
        }
      }
    },
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'tuxedo-bar': tuxedoBar,
      'el-pagination': Pagination
    },
    watch: {
      'loading.serverInfo'(v) {
        if (v) {
          this.loadingInstance.serverInfo = Loading.service({
            target: this.$refs.loadingInstance_serverInfo
          })
        } else {
          if (this.loadingInstance.serverInfo) {
            this.loadingInstance.serverInfo.close()
            this.loadingInstance.serverInfo = null
          }
        }
      },
      'loading.tradeInfo'(v) {
        if (v) {
          this.loadingInstance.tradeInfo = Loading.service({
            target: this.$refs.loadingInstance_tradeInfo
          })
        } else {
          if (this.loadingInstance.tradeInfo) {
            this.loadingInstance.tradeInfo.close()
            this.loadingInstance.tradeInfo = null
          }
        }
      },
      'loading.serviceInfo'(v) {
        if (v) {
          this.loadingInstance.serviceInfo = Loading.service({
            target: this.$refs.loadingInstance_serviceInfo
          })
        } else {
          if (this.loadingInstance.serviceInfo) {
            this.loadingInstance.serviceInfo.close()
            this.loadingInstance.serviceInfo = null
          }
        }
      },
      'loading.queueInfo'(v) {
        if (v) {
          this.loadingInstance.queueInfo = Loading.service({
            target: this.$refs.loadingInstance_queueInfo
          })
        } else {
          if (this.loadingInstance.queueInfo) {
            this.loadingInstance.queueInfo.close()
            this.loadingInstance.queueInfo = null
          }
        }
      },
      'currentPage.serverInfo'(v) {
        this.getPsr()
      },
      'currentPage.tradeInfo'(v) {
        this.getPclt()
      },
      'currentPage.serviceInfo'(v) {
        this.getPsc()
      },
      'currentPage.queueInfo'(v) {
        this.getPq()
      }
    },
    methods: {
      barChange(queryData) {
        this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
        this.getCurentTimeData()
        this.getPsr()
        this.getPsc()
        this.getPq()
        this.getPclt()
      },
      getCurentTimeData() {
        // 实时
        let that = this
        that.api
          .getBbs({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                interval: this.interval,
                aggrInterval: this.aggrInterval
              }
            }
          })
          .done(res => {
            if (res.code !== 0) return
            let originData = res.data[0] || []
            if (_.isEmpty(originData)) {
              that.currenTime.callBoard = []
            } else {
              let newData = [{
                key: 'Current number of servers',
                value: originData.serverCt
              },
              {
                key: 'Current number of services',
                value: originData.serviceCt
              },
              {
                key: 'Current number of request queues',
                value: originData.queueCt
              },
              {
                key: 'Current number of server groups',
                value: originData.groupCt
              },
              {
                key: 'Current number of interfaces',
                value: originData.interfaceCt
              }
              ]
              that.currenTime.callBoard = newData
            }
          })
      },
      getPsr() {
        // 实时
        let that = this
        that.api
          .getPsr({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                interval: this.interval,
                aggrInterval: this.aggrInterval
              },
              page: {
                index: that.currentPage.serverInfo - 1,
                size: that.pageSize
              }
            },
            beforeSend() {
              that.loading.serverInfo = true
            }
          })
          .done(res => {
            if (res.code !== 0) return
            that.currenTime.serverInfo = res.data.list
            that.total.serverInfo = res.data.count
          })
          .always(res => {
            that.loading.serverInfo = false
          })
      },
      getPsc() {
        let that = this
        that.api
          .getPsc({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                interval: this.interval,
                aggrInterval: this.aggrInterval
              },
              page: {
                index: that.currentPage.serviceInfo - 1,
                size: that.pageSize
              }
            },
            beforeSend() {
              that.loading.serviceInfo = true
            }
          })
          .done(res => {
            if (res.code !== 0) return
            that.currenTime.serviceInfo = res.data.list
            that.total.serviceInfo = res.data.count
          })
          .always(res => {
            that.loading.serviceInfo = false
          })
      },
      getPq() {
        let that = this
        that.api
          .getPq({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                interval: this.interval,
                aggrInterval: this.aggrInterval
              },
              page: {
                index: that.currentPage.queueInfo - 1,
                size: that.pageSize
              }
            },
            beforeSend() {
              that.loading.queueInfo = true
            }
          })
          .done(res => {
            if (res.code !== 0) return
            that.currenTime.queueInfo = res.data.list
            that.total.queueInfo = res.data.count
          })
          .always(res => {
            that.loading.queueInfo = false
          })
      },
      getPclt() {
        let that = this
        that.api
          .getPclt({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                interval: this.interval,
                aggrInterval: this.aggrInterval
              },
              page: {
                index: that.currentPage.tradeInfo - 1,
                size: that.pageSize
              }
            },
            beforeSend() {
              that.loading.tradeInfo = true
            }
          })
          .done(res => {
            if (res.code !== 0) return
            res.data.list.map(m => {
              m.bca = m.begin + '/' + m.completed + '/' + m.abort
            })
            that.currenTime.tradeInfo = res.data.list
            that.total.tradeInfo = res.data.count
          })
          .always(res => {
            that.loading.tradeInfo = false
          })
      },
      serverInfoHandleCurrentChange(v) {
        this.currentPage.serverInfo = v
      },
      tradeInfoHandleCurrentChange(v) {
        this.currentPage.tradeInfo = v
      },
      serviceInfoHandleCurrentChange(v) {
        this.currentPage.serviceInfo = v
      },
      queueInfoHandleCurrentChange(v) {
        this.currentPage.queueInfo = v
      }
    }
  }
</script>

