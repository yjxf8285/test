<style lang="scss" scoped>
.table-box {
  position: relative;
}
</style>
<template>
  <div class="web-affair-detail">
    <div class="query-bar">
      <el-button class="back-btn" @click="back" size="small">返回</el-button>
    </div>
    <div class="page-container">
      <chart-lines
        :loading="topNLineData.loading"
        :data="topNLineData.data"
        :title="topNLineData.title"
      ></chart-lines>
      <h4 class="mt20">事务分解</h4>
      <el-table
        :data="tdList"
        stripe
        style="width: 100%" class="mt20">

        <el-table-column
          prop="name"
          label="方法名">
        </el-table-column>
        <el-table-column
          prop="type"
          label="分类">
        </el-table-column>
        <el-table-column
          prop="count"
          width="90"
          label="调用次数">
        </el-table-column>
        <el-table-column
          prop="avg"
          width="180"
          label="平均响应时间(ms)">
        </el-table-column>
      </el-table>
      <chart-lines class="mt20"
                   :loading="countLineData.loading"
                   :data="countLineData.data"
                   :title="countLineData.title"
      ></chart-lines>
      <h4 class="mt20">当前慢事务列表</h4>
      <div class="search-bar"></div>
      <div class="table-box" ref="tableContainer">
        <el-table
          :data="stList.data"
          stripe
          style="width: 100%" class="mt20">
          <el-table-column
            type="index"
            width="100"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="agentName"
            label="实例">
          </el-table-column>
          <el-table-column
            prop="name"
            label="事务">
            <template slot-scope="scope">
              <a class="theme-font-color-primary" target="_blank"
                 :href="goToSingleDetail(scope.row.traceId)">{{ scope.row.name }}</a>

            </template>
          </el-table-column>
          <el-table-column
            prop="elapsed"
            label="响应耗时(ms)">
          </el-table-column>
        </el-table>
        <div class="pag-wrap">
          <el-pagination
            v-show="stList.total > 0"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :total="stList.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartLines from '_charts/chart-lines'
import { Table, TableColumn, Pagination, Button, Loading } from 'element-ui'
import util from '_util'

export default {
  data() {
    return {
      queryData: this.$route.query,
      topNLineData: {
        loading: false,
        title: 'Web事务中各组件平均响应时间堆叠图',
        data: {}
      },
      tdList: [],
      countLineData: {
        loading: false,
        title: '事务平均吞吐量',
        data: {}
      },
      stList: {
        data: [],
        total: 0,
        loading: false,
        loadingInstance: null
      },

      curPage: 0,
      pageSize: 10
    }
  },
  watch: {
    curPage: {
      deep: true,
      handler(v) {
        this.getListFromURI()
      }
    },
    'stList.loading'(v) {
      if (v) {
        this.stList.loadingInstance = Loading.service({
          target: this.$refs.tableContainer
        })
      } else {
        if (this.stList.loadingInstance) {
          this.stList.loadingInstance.close()
          this.stList.loadingInstance = null
        }
      }
    }
  },
  components: {
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'chart-lines': chartLines
  },
  mounted() {
    this.getLineChartData()
  },
  methods: {
    goToSingleDetail(traceId) {
      let baseUrl = this.$route.query.tierId
        ? '/#/snapshot/single-trans-snapshot/single-trans-overview'
        : '/#/snapshot/single-trans-snapshot/single-trans-overview'
      let query = Object.assign({}, this.$route.query, {
        traceId: traceId,
        referrer: encodeURIComponent(
          JSON.stringify({
            name: this.$route.name,
            query: this.$route.query
          })
        )
      })
      query = Object.keys(query)
        .map(prop => {
          return prop + '=' + encodeURIComponent(query[prop])
        })
        .join('&')
      let link = `${baseUrl}?${query}`
      console.log(link)
      return link

      /* this.$router.push({
         name: this.$route.query.tierId ? 'tier-single-transaction-snapshot' : 'single-trans-snapshot',
         query: Object.assign({}, this.$route.query, {
         traceId: traceId,
         referrer: encodeURIComponent(JSON.stringify({
         name: this.$route.name,
         query: this.$route.query
         }))
         })
         }) */
    },
    handleCurrentChange(val) {
      this.curPage = val - 1
    },
    // Web事务中各组件平均响应时间堆叠图数据获取
    getLineChartData() {
      let that = this
      this.api.getAvgResponseTimeFromURI({
        data: Object.assign(
          {
            size: 10
          },
          this.queryData
        ),
        beforeSend() {
          that.topNLineData.loading = true
        },
        complete() {
          that.topNLineData.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          that.topNLineData.data = res || {}
        }
      })
      // 事务分解
      this.api.getSpanWebTranDec({
        data: Object.assign(
          {
            size: 10,
            queryStr: ''
          },
          this.queryData
        ),
        success(res) {
          if (res.code !== 0) return
          res.data.map(m => {
            m.avg = util.toDecimal(m.avg, 3)
          })
          that.tdList = res.data
        }
      })
      // 事务平均吞吐量
      this.api.getTpsFromURI({
        data: Object.assign({}, this.queryData),
        beforeSend() {
          that.countLineData.loading = true
        },
        complete() {
          that.countLineData.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          res.unit = ''
          that.countLineData.data = res || {}
        }
      })
      this.getListFromURI()
    },

    getListFromURI() {
      let that = this
      // 当前慢事务列表
      this.api.getListFromURI({
        data: Object.assign(
          {
            size: this.pageSize,
            page: this.curPage,
            queryStr: ''
          },
          this.queryData
        ),
        beforeSend() {
          that.stList.loading = true
        },
        success(res) {
          if (res.code !== 0) return
          res.data.list.map(m => {
            m.time = util.formatDate(m.time, 5)
          })
          that.stList.data = res.data.list
          that.stList.total = res.data.count
        },
        complete() {
          that.stList.loading = false
        }
      })
    },
    back() {
      window.history.back()
    }
  }
}
</script>
