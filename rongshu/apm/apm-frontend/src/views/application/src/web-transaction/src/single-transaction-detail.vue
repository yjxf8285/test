<style lang="scss" scoped>
.table-box {
  position: relative;
}
</style>
<template>
  <div class="">
    <div class="query-bar">
      <el-button class="back-btn" @click="back" size="small">返回</el-button>
    </div>
    <div class="page-container table-box" ref="tableContainer">
      <h4>事务分解</h4>
      <el-table
        :data="avgListData"
        stripe
        style="width: 100%" class="mt20">
        <el-table-column
          prop="name"
          label="代码段">
        </el-table-column>
        <el-table-column
          prop="type"
          label="分类">
        </el-table-column>
        <el-table-column
          prop="count"
          label="调用次数">
        </el-table-column>
        <el-table-column
          prop="avg"
          label="平均耗时（ms）">
        </el-table-column>
        <el-table-column
          prop="max"
          label="最大(ms)">
        </el-table-column>
        <el-table-column
          prop="min"
          label="最小(ms)">
        </el-table-column>
      </el-table>
      <h4 class="mt20">追踪详情</h4>
      <table-tree
        :datas="stackListData"
      ></table-tree>
      <h4 class="mt20">请求详情</h4>
      <el-table
        :data="requestListData"
        stripe
        style="width: 100%" class="mt20">
        <el-table-column
          prop="name"
          label="参数名称">
        </el-table-column>
        <el-table-column
          prop="value"
          label="值">
        </el-table-column>
      </el-table>
      <h4 class="mt20">SQL调用</h4>
      <el-table
        :data="sqlListData"
        stripe
        style="width: 100%" class="mt20">
        <el-table-column
          prop="name"
          label="SQL">
        </el-table-column>
        <el-table-column
          prop="avg"
          label="平均执行时间(ms)">
        </el-table-column>
        <el-table-column
          prop="min"
          label="最小执行时间(ms)">
        </el-table-column>
        <el-table-column
          prop="max"
          label="最大执行时间(ms)">
        </el-table-column>
        <el-table-column
          prop="count"
          label="执行次数">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import util from '_util'
import { Table, Button, TableColumn, Loading } from 'element-ui'
export default {
  data() {
    return {
      queryData: this.$route.query,
      avgListData: [],
      stackListData: [],
      requestListData: [],
      sqlListData: [],
      tableTreeData: [],
      loading: false,
      loadingInstance: null
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'table-tree': require('_ui-mod/table-tree'),
    'el-button': Button
  },
  mounted() {
    this.getData()
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
    }
  },
  methods: {
    getData() {
      let that = this

      let getComponentsAvg = that.api.getComponentsAvg({
        data: {
          traceId: that.queryData.traceId
        },
        success(res) {
          if (res.code !== 0) return
          res.data.map(m => {
            m.avg = util.toDecimal(m.avg, 3)
          })
          that.avgListData = res.data
        }
      })
      let getSpanStack = that.api.getSpanStack({
        data: {
          traceId: that.queryData.traceId
        },
        success(res) {
          if (res.code !== 0) return
          that.stackListData = res.data
        }
      })
      let getwebRequestInfo = that.api.getwebRequestInfo({
        data: {
          traceId: that.queryData.traceId
        },
        success(res) {
          if (res.code !== 0) return
          that.requestListData = res.data
        }
      })
      let getwebSqlInfo = that.api.getwebSqlInfo({
        data: {
          traceId: that.queryData.traceId
        },
        success(res) {
          if (res.code !== 0) return
          res.data.map(m => {
            m.avg = util.toDecimal(m.avg, 3)
          })
          that.sqlListData = res.data
        }
      })
      that.loading = true
      Promise.all([
        getComponentsAvg,
        getSpanStack,
        getwebRequestInfo,
        getwebSqlInfo
      ])
        .then(result => {
          that.loading = false
        })
        .catch(ex => {
          console.log(ex)
          that.loading = false
        })
    },
    back() {
      window.history.back()
    }
  }
}
</script>

