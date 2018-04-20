<style lang="scss" scoped>
.remote-performance {
  margin-top: 15px;
  .chart-wrap {
    width: 100%;
    height: 300px;
  }
  .content {
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 16px;
    &:last-child {
      border-bottom-width: 0px;
    }
  }
}
</style>

<template>
  <div class="remote-performance">
    <div class="header-title tabstyle">
      <i class="title-icon icon ion-podium"></i>
      <span class="title-name">吞吐率及响应时间趋势</span>
    </div>
    <div class="content chart-wrap">
      <ChartLineBar ref="chartLineBar"
        :optionData="throughputAndTimeTrendOptions" />
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
        :data="invokerElaseTimeData" />
    </div>
    <div class="header-title tabstyle">
      <i class="title-icon icon ion-podium"></i>
      <span class="title-name">远程调用列表</span>
    </div>
    <div class="content">
      <el-table :data="InvokerListData" stripe style="width: 100%">
          <el-table-column prop="transName" label="调用者事务"></el-table-column>
          <el-table-column prop="tierName" label="Tier"></el-table-column>
          <el-table-column prop="responseTimePercentage" sortable label="响应时间占比"></el-table-column>
          <el-table-column prop="responseTimeAvg" sortable label="平均响应时间 (ms)"></el-table-column>
          <el-table-column prop="throughput" label="吞吐率"></el-table-column>
          <el-table-column prop="requestCount" label="请求次数"></el-table-column>
        </el-table>
    </div>
  </div>

</template>

<script>
import util from '_util'
import StackedBarChart from '_charts/chart-stacked-bar.vue'
import ChartLineBar from '_components/charts/chart-linebar.vue'
import mixin from './mixin'
import { Pagination, Table, TableColumn } from 'element-ui'
export default {
  name: 'remote-performance',
  components: {
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    ChartLineBar,
    StackedBarChart
  },
  mixins: [mixin],
  data() {
    return {
      legentMaxLength: 10,
      throughputAndTimeTrendOptions: {},
      invokerElaseTimeData: [],
      InvokerListData: []
    }
  },
  methods: {
    getThroughputAndTimeTrend(condition) {
      let vm = this
      return vm.api
        .getThroughputAndTimeTrend({
          data: {
            condition: condition
          }
        })
        .then(res => {
          if (res.code === 0) {
            let avgline = res.data.map(item => {
              return {
                time: item.startTime,
                value: item.responseTime
              }
            })
            let bar = res.data.map(item => {
              return {
                time: item.startTime,
                value: item.throughput
              }
            })

            vm.throughputAndTimeTrendOptions = {
              grid: {
                left: '80px'
              },
              legend: {
                data: ['吞吐率', '响应时间']
              },
              xAxis: [
                {
                  data: bar.map(m => util.formatDate(m.time, 2))
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    formatter: '{value} rpm'
                  }
                },
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    formatter: '{value} ms'
                  }
                }
              ],
              series: [
                {
                  name: '吞吐率',
                  type: 'bar',
                  stack: '吞吐率',
                  data: bar.map(m => m.value)
                },
                {
                  name: '响应时间',
                  type: 'line',
                  smooth: true,
                  yAxisIndex: 1,
                  data: avgline.map(m => m.value)
                }
              ]
            }
          }
        })
    },
    getInvokerElapsedTimePercentage(condition) {
      return this.api
        .getInvokerElapsedTimePercentage({
          data: {
            condition: condition
          }
        })
        .then(res => {
          if (res.code !== 0) return
          let data = res.data || []
          this.invokerElaseTimeData = data.map(item => {
            return {
              name: item.callerName,
              value: item.percentage
            }
          })
        })
    },
    getInvokerList(condition) {
      return this.api
        .getInvokerList({
          data: {
            condition: condition
          }
        })
        .then(res => {
          if (res.code !== 0) return
          let data = res.data || []
          this.InvokerListData = data
        })
    },
    reload() {
      this.getThroughputAndTimeTrend(this.condition)
      this.getInvokerElapsedTimePercentage(this.condition)
      this.getInvokerList(this.condition)
    }
  }
}
</script>
