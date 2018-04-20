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
        <span class="title-name">服务器信息</span>
      </div>
      <div class="content">
        <div class="table-box" ref="tableContainer">
          <el-table :data="serverInfo" stripe style="width: 100%" class="mt20">
            <el-table-column prop="progName" label="Prog Name"></el-table-column>
            <el-table-column prop="queueName" label="Queue Name"></el-table-column>
            <el-table-column prop="groupName" label="Grp Name"></el-table-column>
            <el-table-column prop="serverId" label="ID"></el-table-column>
            <el-table-column prop="requestDone" label="RqDone"></el-table-column>
            <el-table-column prop="loadDone" label="Load Done"></el-table-column>
            <el-table-column prop="serverStatus" label="Current Service"></el-table-column>
          </el-table>
          <div class="pag-wrap">
            <el-pagination v-show="total > 0" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">{{busyServer.title}}</span>
      </div>
      <div class="content">
        <cm-line :loading="busyServer.loading" :data="busyServer.data" :title="busyServer.title"></cm-line>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">{{loadDone.title}}</span>
      </div>
      <div class="content">
        <cm-line :loading="loadDone.loading" :data="loadDone.data" :title="loadDone.title"></cm-line>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">{{reqDone.title}}</span>
      </div>
      <div class="content">
        <cm-line :loading="reqDone.loading" :data="reqDone.data" :title="reqDone.title"></cm-line>
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
      sysTimeValS: {
        name: '',
        id: ''
      },
      sysTimes: [],
      serverInfo: [],
      busyServer: {
        loading: false,
        title: '忙服务器占比',
        data: {
          data: []
        }
      },
      loadDone: {
        loading: false,
        title: '负载吞吐量',
        data: {
          data: []
        }
      },
      reqDone: {
        loading: false,
        title: '请求吞吐量',
        data: {
          data: []
        }
      },
      loading: false,
      loadingInstance: null,
      pageSize: 10,
      currentPage: 1,
      total: 10
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
    'tuxedo-bar': tuxedoBar,
    'el-pagination': Pagination
  },
  mounted() {},
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
    currentPage() {
      this.getServerData()
    }
  },
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.getServerData()
      this.getChartData()
    },
    getServerData() {
      let that = this
      // 服务器
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
              index: that.currentPage - 1,
              size: that.pageSize
            }
          },
          beforeSend() {
            that.loading = true
          }
        })
        .done(res => {
          if (res.code !== 0) return
          that.serverInfo = res.data.list
          that.total = res.data.count
        })
        .always(res => {
          that.loading = false
        })
    },
    getChartData() {
      let that = this
      that.api
        .getBusyServerRate({
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
            that.busyServer.loading = true
          }
        })
        .done(res => {
          if (res.code !== 0) return
          that.busyServer.loading = false
          that.busyServer.data = res
        })
      that.api
        .getPsrLoad({
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
          that.loadDone.data = res
        })
      that.api
        .getPsrRequest({
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
          that.reqDone.data = res
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

