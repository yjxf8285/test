<style lang="scss" scoped>
.topn-tit {
  font-size: 14px;
  float: left;
  margin-top: 10px;
}

.search-input {
  float: right;
  width: 200px;
}
</style>
<template>
  <div class="app-total">
    <top-bar @barChange="barChange"></top-bar>
    <div class="page-container">
      <!-- Web事务平均响应时间 -->
      <chart-lines :loading="resTimeAvgData.loading" :data="resTimeAvgData.data"
                   :title="resTimeAvgData.title"></chart-lines>
      <!-- 吞吐量 -->
      <chart-lines :loading="shroughputData.loading" :data="shroughputData.data"
                   :title="shroughputData.title"></chart-lines>
      <!-- Apdex -->
      <chart-lines :loading="apdexData.loading" :data="apdexData.data" :title="apdexData.title"></chart-lines>
      <chart-lines :loading="errorRateData.loading" :data="errorRateData.data"
                   :title="errorRateData.title"></chart-lines>
      <!-- 应用慢事务 -->
      <div class="topn-tablelist">
        <div class="clearfix">
          <div class="topn-tit">TopN 应用慢事务</div>
          <el-input placeholder="请输入名称"  size="small" class="search-input"
                    v-model="topNchartData.searchName" @change="handleSearchTopn"></el-input>
        </div>
        <div class="table-box" ref="tableContainer">
          <el-table
            :data="topNchartData.data"
            stripe
            style="width: 100%" class="mt10">
            <el-table-column
              type="index"
              width="100"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称">
              <template slot-scope="scope">
                <a class="theme-font-color-primary" href="javascript:void 0;"
                   @click="goToNextPage(scope.row.name)">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="max"
              label="最大值">
            </el-table-column>
            <el-table-column
              prop="min"
              label="最小值">
            </el-table-column>
            <el-table-column
              prop="avg"
              label="平均值">
            </el-table-column>
            <el-table-column
              prop="count"
              label="发生次数">
            </el-table-column>
          </el-table>
        </div>
        <div class="pag-wrap">
          <el-pagination
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="topNchartData.size"
            :total="topNchartData.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import TnBar from '_charts/topn-bar'
import ChartLines from '_charts/chart-lines'
import { Table, TableColumn, Button, Pagination, Input } from 'element-ui'
export default {
  name: 'app-total',
  components: {
    'el-table': Table,
    'el-input': Input,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-pagination': Pagination,
    TnBar,
    ChartLines
  },
  data() {
    return {
      op: {},
      queryData: {},
      topNchartData: {
        total: 0,
        size: 5,
        searchName: '',
        loading: false,
        title: 'Top5 应用慢事务',
        link: this.$route.query.tierId
          ? 'tier-web-slow-transaction-satisfy'
          : 'web-slow-transaction-satisfy',
        allData: [], // 因为后端不提供分页和搜索功能，这里要保存所有的数据
        data: [] // 当前显示的数据
      },
      resTimeAvgData: {
        title: 'Web事务平均响应时间',
        data: {},
        loading: false
      },
      shroughputData: {
        title: '吞吐率',
        data: {},
        loading: false
      },
      apdexData: {
        title: 'Apdex',
        data: {},
        loading: false
      },
      errorRateData: {
        title: '错误数',
        data: {},
        loading: false
      },
      topNTransData: {
        loading: false,
        title: 'Top5 Web事务',
        link: this.$route.query.tierId
          ? 'tier-web-slow-transaction-satisfy'
          : 'web-slow-transaction-satisfy',
        data: []
      },
      eventListData: []
    }
  },
  watch: {
    queryData: {
      deep: true,
      handler(v) {
        this.renderCharts(v)
      }
    }
  },
  methods: {
    barChange(obj) {
      if (obj && obj.length) {
        this.queryData = {
          interval: obj[0].id,
          systemId: obj[1].id,
          groupId: obj[2].id,
          agentId: obj[3].id
        }
      }
      this.getTopNData(this.queryData)
    },
    goToNextPage(name) {
      let vm = this
      let link = this.$route.query.tierId
        ? 'tier-web-slow-transaction-satisfy'
        : 'web-slow-transaction-satisfy'
      vm.$router.push({
        name: link,
        query: Object.assign(
          {},
          vm.$route.query,
          {
            queryStr: name
          },
          vm.queryData
        )
      })
    },
    getTopNData(query) {
      let vm = this
      // TopN Web事务
      vm.api
        .getSpanQueryTop({
          data: Object.assign(
            {
              type: 1,
              size: 5
            },
            query
          ),
          beforeSend() {
            vm.topNTransData.loading = true
          }
        })
        .done(res => {
          let topNchartData = this.topNchartData
          if (res.code !== 0) return
          topNchartData.allData = res.data
          topNchartData.data = util.pagingData(
            0,
            topNchartData.size,
            topNchartData.allData
          )
          topNchartData.total = res.data.length
          topNchartData.loading = false
        })
        .always(() => {
          vm.topNTransData.loading = false
        })
    },
    renderCharts: function(query) {
      let vm = this
      // 响应时间
      vm.api
        .getWebTransactionAvgResponseTime({
          data: Object.assign(
            {
              size: 2
            },
            query
          ),
          beforeSend() {
            vm.resTimeAvgData.loading = true
          }
        })
        .done(res => {
          vm.resTimeAvgData.data = res || {}
        })
        .always(() => {
          vm.resTimeAvgData.loading = false
        })
      // 吞吐量
      vm.api.getWebTransactionTps({
        data: Object.assign(
          {
            size: 10
          },
          query
        ),
        beforeSend() {
          vm.shroughputData.loading = true
        },
        success(res) {
          if (res.code !== 0) return
          vm.shroughputData.data = res || {}
          vm.shroughputData.loading = false
        }
      })
      // Apdex
      vm.api
        .geApdexData({
          // data: Object.assign({
          // }, query),
          data: {
            groupId: this.$route.query.tierId || '',
            systemId: query.systemId,
            interval: query.interval,
            agentId: query.agentId
          },
          beforeSend() {
            vm.apdexData.loading = true
          }
        })
        .done(res => {
          vm.apdexData.data = res || {}
        })
        .always(() => {
          vm.apdexData.loading = false
        })

      // 错误率
      vm.api
        .getErrorRateData({
          data: Object.assign(
            {
              size: 10
            },
            query
          ),
          beforeSend() {
            vm.errorRateData.loading = true
          }
        })
        .done(res => {
          vm.errorRateData.data = res || {}
        })
        .always(() => {
          vm.errorRateData.loading = false
        })

      vm.getTopNData(query)
    },
    handleSearchTopn(keyWord) {
      let topnData = this.topNchartData.allData
      let resData = topnData.filter(m => m.name.search(keyWord) >= 0)
      this.topNchartData.data = util.pagingData(
        0,
        this.topNchartData.size,
        resData
      )
      this.topNchartData.total = resData.length
    },
    handleCurrentChange(n) {
      let topnData = this.topNchartData.allData
      this.topNchartData.data = util.pagingData(
        n - 1,
        this.topNchartData.size,
        topnData
      )
    }
  }
}
</script>
