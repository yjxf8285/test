<style lang="scss" scoped>
@import "~vars";
.remote-error {
    .content {
      margin-bottom: 16px;
      border-bottom: solid 1px #dcdcdc;
      &:last-child {
        border-bottom-width: 0px;
      }
    }
  .multiple {
    display: flex;
    .l {
      flex: 1;
      padding-top: 15px;
      .content {
        margin-bottom: 16px;
        border-bottom: solid 1px #dcdcdc;
      }
    }
    .r {
      padding-top: 15px;
      width: 540px;
      .content {
        margin-bottom: 16px;
        border-bottom: solid 1px #dcdcdc;
        border-left: solid 1px #dcdcdc;
      }
    }
  }
  .search-input {
    float: right;
    width: 200px;
    margin: 11px;
  }
  .chart-wrap {
    height: 300px;
  }
}
</style>
<template>
  <div class="remote-error">
    <div class="multiple">
      <div class="l">
        <div class="header-title tabstyle">
          <i class="title-icon icon ion-podium"></i>
          <span class="title-name">错误数趋势</span>
        </div>
        <div class="content">
          <div class="chart-wrap">
            <ChartAreaGraph :optionData="errorSectionsOption"></ChartAreaGraph>
          </div>
        </div>
      </div>
      <div class="r">
        <div class="header-title tabstyle" style="border-left:solid 1px #dcdcdc;">
          <i class="title-icon icon ion-document-text"></i>
          <span class="title-name">错误信息（TOP 5）</span>
        </div>
        <div class="content">
          <div class="chart-wrap">
            <ChartPie :optionData="topNErrorOption"></ChartPie>
          </div>
        </div>
      </div>
    </div>
    <div class="header-title tabstyle">
      <i class="title-icon icon ion-podium"></i>
      <span class="title-name">调用者耗时百分比</span>
    </div>
    <div class="content">
      <StackedBarChart
      ref="chartStackedBar"
      :height="150"
      :show-header="false"
      :yAxisCategoryText="'慢元素'"
      :data="chartData" />
    </div>
    <div class="header-title tabstyle">
      <i class="title-icon icon ion-podium"></i>
      <span class="title-name">远程调用列表</span>
    </div>
    <div class="content">
      <el-table :data="invokerErrorCountData" stripe style="width: 100%">
          <el-table-column prop="spanTransaction" label="调用者事务"></el-table-column>
          <el-table-column prop="tierName" label="Tier"></el-table-column>
          <el-table-column prop="agentName" label="实例"></el-table-column>
          <el-table-column prop="errorCount" sortable label="错误次数"></el-table-column>
          <el-table-column prop="reqCount" sortable label="请求次数"></el-table-column>
        </el-table>
    </div>
  </div>

</template>

<script>
import util from '_util'
import ChartAreaGraph from '_components/charts/chart-area-graph.vue'
import ChartPie from '_components/charts/chart-pie-healthy.vue'
import StackedBarChart from '_charts/chart-stacked-bar.vue'
import mixin from './mixin'
import {
  Pagination,
  Table,
  TableColumn
} from 'element-ui'
export default {
  name: 'remote-error',
  components: {
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    ChartAreaGraph,
    ChartPie,
    StackedBarChart
  },
  mixins: [mixin],
  data() {
    return {
      legentMaxLength: 10,
      totalCount: 0,
      errorSectionsOption: {},
      topNErrorOption: {},
      chartData: [],
      invokerErrorCountData: []
    }
  },
  methods: {
    getRemoteErrorSectionsData() {
      this.api
        .getRemoteErrorSectionsData({
          data: {
            condition: this.condition
          }
        })
        .then(res => {
          if (res.code === 0) {
            let list = res.data.bar || []
            let xData = list.map(m => util.formatDate(m.time, 2))
            let yData = list.map(m => m.errorCount)
            this.errorSectionsOption = {
              formatter: function(params, ticket, callback) {
                let formatStr = ''
                params.map(m => {
                  let curItem = list[m.dataIndex]
                  // 标题、时间、错误数、请求数
                  if (curItem) {
                    formatStr = `
                      标题：错误<br>
                      时间：${util.formatDate(curItem.time, 2)}<br>
                      错误数：${curItem.errorCount}<br>
                      请求次数：${curItem.reqCount}<br>
                      `
                    // 错误/分钟：${curItem.errorCountPerMinutes}<br>
                  }
                })
                return formatStr
              },
              xAxis: {
                data: xData
              },
              series: [
                {
                  data: yData
                }
              ]
            }
          }
        })
    },
    getRemoteErrorTopNData() {
      this.api
        .getRemoteErrorTopNData({
          data: {
            condition: this.condition,
            topN: 5
          }
        })
        .then(res => {
          if (res.code === 0) {
            let list = res.data.pie || []

            this.topNErrorOption = {
              legend: {
                orient: 'vertical',
                x: '340',
                y: 'middle',
                data: list.map(m => m.error),
                formatter: function(name) {
                  return name
                }
              },
              series: [
                {
                  name: '错误信息',
                  data: list.map(m => {
                    return {
                      value: m.errorCount,
                      name: m.error
                    }
                  })
                }
              ]
            }
          }
        })
    },
    getRemoteErrorcountPercentage() {
      let vm = this
      return vm.api
        .getRemoteErrorcountPercentage({
          data: {
            condition: vm.condition
          }
        })
        .then(res => {
          if (res.code !== 0) return
          let data = res.data.spanTransactionBar || []
          vm.chartData = vm.getChartData(data)
          vm.invokerErrorCountData = res.data.spanTransactionList || []
        })
    },
    getChartData(data) {
      let vm = this
      let chartData = []
      let another = { name: '其他', value: 0 }
      vm.totalCount = 0
      if (data && data.length > 0) {
        data.forEach((item, index) => {
          if (index < vm.legentMaxLength) {
            chartData.push({
              name: item.spanTransaction,
              value: item.errorCount
            })
          } else {
            another.value += item.errorCount
          }
          vm.totalCount += item.errorCount
        })
        if (another.value > 0) {
          chartData.unshift(another)
        }
        chartData = _.sortBy(chartData, ['value']).reverse()
        chartData.forEach(item => {
          item.value = Math.floor(item.value / vm.totalCount * 10000) / 100
        })
      }
      return chartData
    },
    reload() {
      this.getRemoteErrorSectionsData()
      this.getRemoteErrorTopNData()
      this.getRemoteErrorcountPercentage()
    }
  }
}
</script>
