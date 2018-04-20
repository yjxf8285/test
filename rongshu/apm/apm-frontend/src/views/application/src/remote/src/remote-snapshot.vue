<style lang="scss" scoped>
.remote-snapshot {
  margin-top: 15px;
  .chart-wrap {
    width: 100%;
    height: 300px;
  }
}
.search-input {
  float: right;
  width: 200px;
  margin: 11px 24px;
}
</style>

<template>
  <div class="remote-snapshot">
    <div class="header-title tabstyle">
      <i class="title-icon icon ion-podium"></i>
      <span class="title-name">调用者快照列表</span>
      <el-input placeholder="请输入名称"  size="small" class="search-input" v-model="searchName"
                  @change="handleGetRemoteSnapshotList"></el-input>
    </div>
    <div class="content">
      <el-table :data="snapshotListData" stripe  @sort-change="sortChange" v-loading="snapshotListDataLoading">
        <el-table-column prop="transaction" width="120" label="调用者事务">
          <template slot-scope="scope">
            <a class="theme-font-color-primary" href="javascript:void(0);" @click="redirectToSingleComponent(scope.row)">{{scope.row.transaction}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="tierName" label="Tier"></el-table-column>
        <el-table-column prop="instanceName" label="实例"></el-table-column>
        <el-table-column prop="startTime" label="发生时间" sortable="custom">
          <template slot-scope="scope">
            {{scope.row.startTime}}
          </template>
        </el-table-column>
        <el-table-column prop="elapsed" label="响应时间" sortable="custom"></el-table-column>
        <el-table-column prop="errorName" label="错误类型"></el-table-column>
      </el-table>
      <div class="pag-wrap">
        <el-pagination
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="10"
          :total="snapshotListDataTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import mixin from './mixin'
import { Pagination, Table, TableColumn, Input } from 'element-ui'
export default {
  name: 'remote-snapshot',
  components: {
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input
  },
  mixins: [mixin],
  data() {
    return {
      snapshotListData: [],
      snapshotListDataTotal: 0,
      snapshotListDataLoading: false,
      searchName: '',
      pageIndex: 0,
      sortField: 'startTime',
      sortOrder: 'asc',
      timer: null
    }
  },
  methods: {
    handleGetRemoteSnapshotList() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        if (this.timer) {
          this.getRemoteSnapshotList()
          this.timer = null
        }
      }, 300)
    },
    handleCurrentChange(i) {
      this.pageIndex = i - 1
      this.getRemoteSnapshotList()
    },
    sortChange(sortObj) {
      this.sortField = sortObj.prop || 'startTime'
      if (sortObj.order === 'ascending') this.sortOrder = 'asc'
      if (sortObj.order === 'descending') this.sortOrder = 'desc'
      this.getRemoteSnapshotList()
    },
    getRemoteSnapshotList() {
      this.snapshotListDataLoading = true
      return this.api
        .getRemoteSnapshotList({
          data: {
            condition: Object.assign({}, this.condition, {
              transactionFilter: this.searchName
            }),
            page: {
              index: this.pageIndex,
              size: 10
            },
            sort: {
              field: this.sortField,
              order: this.sortOrder
            }
          }
        })
        .then(res => {
          if (res.code !== 0) return
          this.snapshotListData = res.data.info || []
          this.snapshotListData.forEach(item => {
            item.startTime = util.formatDate(item.startTime)
          })
          this.snapshotListDataTotal = res.data.totalCount
        })
        .always(() => {
          this.snapshotListDataLoading = false
        })
    },
    redirectToSingleComponent(row) {
      this.$root.eventBus.openTab({
        name: row.traceId,
        type: 'single-trans-snapshot',
        options: {
          traceId: row.traceId,
          appId: row.appId,
          queryStr: row.transaction
        }
      })
    },
    reload() {
      this.getRemoteSnapshotList()
    }
  }
}
</script>
