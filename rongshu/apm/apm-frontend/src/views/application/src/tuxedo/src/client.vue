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
        <span class="title-name">交易信息</span>
      </div>
      <div class="content">
        <div class="table-box" ref="tableContainer">
          <el-table :data="clientTradeInfo.data" stripe style="width: 100%" class="mt20">
            <el-table-column prop="lmId" label="LMID"></el-table-column>
            <el-table-column prop="userName" label="User Name"></el-table-column>
            <el-table-column prop="clientName" label="Client Name"></el-table-column>
            <el-table-column prop="linkTime" label="Time Status"></el-table-column>
            <el-table-column prop="bca" label="Bgn/Cmmt/Abrt"></el-table-column>
            <el-table-column prop="status" label="Status"></el-table-column>
          </el-table>
          <div class="pag-wrap">
            <el-pagination v-show="clientTradeInfo.total > 0" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="clientTradeInfo.pageSize" :current-page="clientTradeInfo.currentPage" :total="clientTradeInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">{{busyClient.title}}</span>
      </div>
      <div class="content">
        <cm-line class="mt20" :loading="busyClient.loading" :data="busyClient.data" :title="busyClient.title"></cm-line>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">{{tradeDone.title}}</span>
      </div>
      <div class="content">
        <cm-line :loading="tradeDone.loading" :data="tradeDone.data" :title="tradeDone.title"></cm-line>
      </div>
    </div>
  </div>
</template>

<script>
import chartLines from '_charts/chart-lines'
import tuxedoBar from '@/components/layout/tuxedo-bar.vue'
import {
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
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
      sysTimeValC: {
        name: '',
        id: ''
      },
      sysTimes: [],
      clientTradeInfo: {
        data: [],
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      busyClient: {
        loading: false,
        title: '忙客户占比',
        data: {
          data: []
        }
      },
      tradeDone: {
        loading: false,
        title: '交易吞吐量',
        data: {
          data: []
        }
      },
      loading: false,
      loadingInstance: null
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-button': Button,
    'cm-line': chartLines,
    'el-pagination': Pagination,
    'tuxedo-bar': tuxedoBar
  },
  watch: {
    loading(v) {
      if (v) {
        this.loadingInstance = Loading.service({
          target: this.$refs.tableContainer
        })
      } else {
        if (this.loadingInstance) {
          this.loadingInstance.close()
          this.loadingInstance = null
        }
      }
    },
    'clientTradeInfo.currentPage': {
      deep: true,
      handler(v) {
        this.getPclt()
      }
    }
  },
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.getClientData()
    },
    getClientData() {
      let that = this
      that.getPclt()
      that.getBusyClientRate()
      that.gettrade()
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
              index: that.clientTradeInfo.currentPage - 1,
              size: that.clientTradeInfo.pageSize
            }
          },
          beforeSend() {
            that.loading = true
          }
        })
        .done(res => {
          if (res.code !== 0) return
          res.data.list.map(m => {
            m.bca = m.begin + '/' + m.completed + '/' + m.abort
          })
          that.clientTradeInfo.data = res.data.list
          that.clientTradeInfo.total = res.data.count
        })
        .always(res => {
          that.loading = false
        })
    },
    getBusyClientRate() {
      let that = this
      that.api
        .getBusyClientRate({
          data: {
            condition: {
              appId: this.appId,
              startTime: this.startTime,
              endTime: this.endTime,
              interval: this.interval,
              aggrInterval: this.aggrInterval
            }
          },
          beforeSend() {
            that.busyClient.loading = true
          }
        })
        .done(res => {
          if (res.code !== 0) return
          that.busyClient.data = res
          that.busyClient.loading = false
        })
    },
    gettrade() {
      let that = this
      that.api
        .gettrade({
          data: {
            condition: {
              appId: this.appId,
              startTime: this.startTime,
              endTime: this.endTime,
              interval: this.interval,
              aggrInterval: this.aggrInterval
            }
          },
          beforeSend() {
            that.tradeDone.loading = true
          }
        })
        .done(res => {
          if (res.code !== 0) return
          that.tradeDone.data = res
          that.tradeDone.loading = false
        })
    },
    handleCurrentChange(val) {
      this.clientTradeInfo.currentPage = val
    }
  }
}
</script>

