<style lang="scss" scoped>
@import "~vars";

.error {
  .multiple {
    display: flex;
    .l {
      flex: 1;
    }
    .r {
      width: 540px;
      .content {
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
  <div class="error">
    <top-bar title="数据库" @barChange="topbarChange"></top-bar>
    <FilterBarComplex :filterList="filterListData" style="margin-top: 1px"
                      @fbarChange="filterbarChange"></FilterBarComplex>
    <div class="common-container">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="数据实例" name="instances"></el-tab-pane>
        <el-tab-pane label="操作命令" name="operations"></el-tab-pane>
        <el-tab-pane label="调用者" name="callers"></el-tab-pane>
      </el-tabs>
      <div class="header-title tabstyle">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">按不同维度分类数据库列表TOP5</span>

      </div>
      <div class="content">
        <el-table
          :data="getDatabaseTopNList"
          @sort-change="topNsortChange"
          v-loading="topNListloading"
        >
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column prop="name" :label="metricNameCH"></el-table-column>
          <el-table-column prop="timeSpentRatio" label="总耗时百分比" sortable="custom">
            <template slot-scope="scope">
              <span>{{scope.row.timeSpentRatio}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="throughput" label="吞吐率(rpm)
" sortable="custom"></el-table-column>
          <el-table-column prop="requestCount" label="调用次数
" sortable="custom"></el-table-column>
          <el-table-column prop="avgResponseTime" label="SQL耗时(ms)
" sortable="custom"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">数据库趋势图</span>
        <div class="right-info">
          <span>平均SQL耗时：{{databaseTrendTitalInfo.sqlElapsedAvg}} ms </span>
          <span>吞吐率：{{databaseTrendTitalInfo.throughput}} rpm</span>
        </div>
      </div>
      <div class="content">
        <div class="chart-wrap">
          <ChartLineBar :optionData="databaseTrendOptionData"></ChartLineBar>
        </div>

      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">时间分布图</span>
      </div>
      <div class="content">
        <div class="chart-wrap">
          <ChartLineBar :optionData="diagramSectionSummaryOptionData"></ChartLineBar>
        </div>

      </div>
    </div>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">SQL快照列表</span>
        <el-input placeholder="按SQL语句搜索
"  size="small" class="search-input" v-model="searchName"
                  @change="handleSearchsnapshotSql"></el-input>
      </div>
      <div class="content">
        <el-table v-loading="snapshotSqlloading" :data="snapshotSqlData" @sort-change="snapshotSqlSortChange">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column width="200" prop="caller" label="调用者 ">
            <template slot-scope="scope">
              <a class="theme-font-color-primary"
                 href="javascript:void(0);"
                 @click="goToNextPage(scope.row.traceId,scope.row.caller)">{{ scope.row.caller }}</a>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="occurTime" label="发生时间" sortable="custom"></el-table-column>
          <el-table-column width="100" prop="operation" label="操作命令"></el-table-column>
          <el-table-column width="300" prop="databaseAddress" label="数据库实例"></el-table-column>
          <el-table-column width="120" prop="elapsedTime" label="SQL耗时" sortable="custom"></el-table-column>
          <el-table-column prop="statement" label="SQL语句 ">
            <template slot-scope="scope">
              <div :title="scope.row.statement" style="{
                   overflow: hidden;
                   text-overflow: ellipsis;
                   word-wrap: break-word;
                   display: -webkit-box;
                   -webkit-line-clamp: 3;
                   -webkit-box-orient: vertical;
            }">{{scope.row.statement}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pag-wrap">
          <el-pagination
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="10"
            :total="snapshotSqlDataTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import ChartLineBar from '_components/charts/chart-linebar.vue'
import ChartAreaGraph from '../../../../../components/charts/chart-area-graph.vue'
import ChartPie from '../../../../../components/charts/chart-pie-healthy.vue'
import {
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tooltip,
  Button,
  Pagination,
  Input
} from 'element-ui'
import topBarQuery from '../../../../../components/mixin/topBarQuery'

export default {
  name: 'error',
  mixins: [topBarQuery],
  components: {
    ChartPie,
    ChartAreaGraph,
    ChartLineBar,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-table': Table,
    'el-tooltip': Tooltip,
    'el-table-column': TableColumn,
    'el-button': Button
  },
  mounted() {},
  data() {
    return {
      topNListloading: true,
      activeName: 'instances',
      getDatabaseTopNList: [],
      metricName: 'instances',
      metricNameCH: '数据库实例',
      topNsortField: 'avg_response_time',
      topNsortOrder: 'desc',
      // topN state data end
      searchName: '',
      snapshotSqlData: [],
      snapshotSqlDataTotal: 0,
      snapshotSqlloading: true,
      pageIndex: 0,
      sqlSortField: 'finishTime',
      sqlSortOrder: 'desc',
      // snapshotSql end
      topNErrorOption: {},
      errorSectionsOption: {},
      errorSectionsOverview: {
        errorNum: 0,
        errorPerMinute: 0
      },
      diagramSectionSummaryOptionData: {},
      databaseTrendOptionData: {},
      databaseTrendTitalInfo: {
        sqlElapsedAvg: '-',
        throughput: '-'
      },
      topBarData: [],
      fiterBarData: [],
      filterListData: []
    }
  },
  computed: {
    responsetime() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'responsetime') &&
          this.fiterBarData
            .find(m => m.itemId === 'responsetime')
            .infoData.map(m => m.value)) ||
        []
      )
    },
    callerArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'callers') &&
          this.fiterBarData
            .find(m => m.itemId === 'callers')
            .infoData.map(m => m.value)) ||
        []
      )
    },
    databaseAddressArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'datbases') &&
          this.fiterBarData
            .find(m => m.itemId === 'datbases')
            .infoData.map(m => m.value)) ||
        []
      )
    },
    operationArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'operations') &&
          this.fiterBarData
            .find(m => m.itemId === 'operations')
            .infoData.map(m => m.value)) ||
        []
      )
    }
  },
  methods: {
    topbarChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.getErrorSummaryData()
      this.getData()
    },
    filterbarChange(query) {
      this.fiterBarData = query
      this.getData()
    },
    handleSearchsnapshotSql() {
      this.getDatabasesnapshotSqlListData()
    },
    handleCurrentChange(i) {
      this.pageIndex = i - 1
      this.getDatabasesnapshotSqlListData()
    },
    getData() {
      this.getDatabasetopn()
      this.getDatabasesnapshotSqlListData()
      this.getDatabaseTrendData()
      this.getDatabasesdiagramSectionSummaryData()
    },
    goToNextPage(traceId, transName) {
      this.$root.eventBus.openTab({
        name: traceId,
        options: {
          traceId: traceId,
          appId: this.$root.eventBus.getCurSystem().id || '',
          queryStr: transName
        }
      })
    },
    tabClick(pane) {
      this.metricName = pane.name
      switch (pane.name) {
        case 'instances':
          this.metricNameCH = '数据库实例'
          break
        case 'operations':
          this.metricNameCH = '操作命令'
          break
        case 'callers':
          this.metricNameCH = '调用者'
          break
      }
      this.getDatabasetopn()
    },
    topNsortChange(sortObj) {
      switch (sortObj.prop) {
        case 'timeSpentRatio':
          this.topNsortField = 'sum_response_time'
          break
        case 'avgResponseTime':
          this.topNsortField = 'avg_response_time'
          break
        case 'requestCount':
          this.topNsortField = 'call_times'
          break
        case 'throughput':
          this.topNsortField = 'sum_throughput'
          break
      }

      switch (sortObj.order) {
        case 'ascending':
          this.topNsortOrder = 'asc'
          break
        case 'descending':
          this.topNsortOrder = 'desc'
          break
      }
      this.getDatabasetopn()
    },
    snapshotSqlSortChange(sortObj) {
      this.sqlSortField = sortObj.prop || 'finishTime'
      switch (sortObj.prop) {
        case 'occurTime':
          this.sqlSortField = 'finishTime'
          break
        case 'elapsedTime':
          this.sqlSortField = 'selfElapsed'
          break
      }
      switch (sortObj.order) {
        case 'ascending':
          this.sqlSortOrder = 'asc'
          break
        case 'descending':
          this.sqlSortOrder = 'desc'
          break
      }
      this.getDatabasesnapshotSqlListData()
    },
    getDatabasetopn() {
      this.topNListloading = true
      this.api
        .getDatabasetopn({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              minResponseTime: this.responsetime[0],
              maxResponseTime: this.responsetime[1],
              databaseTypeArray: this.databaseAddressArray,
              operationArray: this.operationArray,
              callerArray: this.callerArray
            },
            sort: {
              // 必选
              field: this.topNsortField, // 必选，排序条件，可以是sum_response_time，avg_response_time，call_times，sum_throughput
              order: this.topNsortOrder // 必选，可以是 asc和desc
            },
            topN: 5, // 必选
            metricName: this.metricName // 必选，可以是callers， instances，operationType
          }
        })
        .then(res => {
          if (res.code === 0) {
            this.getDatabaseTopNList = res.data.unitList || []
          }
        })
        .always(res => {
          this.topNListloading = false
        })
    },
    getDatabaseTrendData() {
      this.api
        .getDatabaseTrend({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              interval: this.interval,
              aggrInterval: this.aggrInterval,
              minResponseTime: this.responsetime[0],
              maxResponseTime: this.responsetime[1],
              databaseTypeArray: this.databaseAddressArray,
              operationArray: this.operationArray,
              callerArray: this.callerArray
            }
          }
        })
        .then(res => {
          if (res.code === 0) {
            let lineArr = res.data.databaseSqlElapsedTrendDataList || []
            let barArr = res.data.databaseThroughputTrendDataList || []
            this.databaseTrendTitalInfo = {
              sqlElapsedAvg: res.data.sqlElapsedAvg,
              throughput: res.data.throughput
            }
            this.databaseTrendOptionData = {
              legend: {
                data: ['吞吐率', '平均SQL耗时']
              },
              xAxis: [
                {
                  data: barArr.map(m => util.formatDate(m.time))
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: 'rpm',
                  axisLabel: {
                    formatter: '{value} rpm'
                  }
                },
                {
                  type: 'value',
                  name: 'ms',
                  axisLabel: {
                    formatter: '{value} ms'
                  }
                }
              ],
              series: [
                {
                  name: '吞吐率',
                  type: 'bar',
                  stack: '总量',
                  data: barArr.map(m => m.throughput)
                },
                {
                  name: '平均SQL耗时',
                  type: 'line',
                  smooth: true,
                  yAxisIndex: 1,
                  data: lineArr.map(m => m.sqlElapsed)
                }
              ]
            }
          }
        })
    },
    getDatabasesdiagramSectionSummaryData() {
      this.api
        .getDatabasesdiagramSectionSummary({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              interval: this.interval,
              minResponseTime: this.responsetime[0],
              maxResponseTime: this.responsetime[1],
              databaseTypeArray: this.databaseAddressArray,
              operationArray: this.operationArray,
              callerArray: this.callerArray
            }
          }
        })
        .then(res => {
          //          console.info(2, res)
          if (res.code === 0) {
            let list = res.data.statArray || []
            let xArr = list.map((m, i) => {
              if (i === list.length - 1) {
                return m.startTime + 'ms以上'
              } else {
                return m.startTime + '-' + m.endTime + 'ms'
              }
            })
            let yArr = list.map(m => m.sqlRequestCount)
            this.diagramSectionSummaryOptionData = {
              xAxis: [
                {
                  type: 'category',
                  axisLabel: {
                    formatter: '{value}'
                  },
                  data: [...xArr]
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    formatter: '{value} 次'
                  }
                }
              ],
              series: [
                {
                  name: '',
                  type: 'bar',
                  data: [...yArr]
                }
              ]
            }
          }
        })
    },
    getDatabasesnapshotSqlListData() {
      this.snapshotSqlloading = true
      this.api
        .getDatabasesnapshotSqlList({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              minResponseTime: this.responsetime[0],
              maxResponseTime: this.responsetime[1],
              databaseTypeArray: this.databaseAddressArray,
              operationArray: this.operationArray,
              callerArray: this.callerArray,
              statement: this.searchName
            },
            sort: {
              field: this.sqlSortField, // 必选，排序条件，只可以是finishTime，selfElapsed中的一个
              order: this.sqlSortOrder
            },
            page: {
              index: this.pageIndex,
              size: 10
            }
          }
        })
        .then(res => {
          if (res.code === 0) {
            res.data.sqlInfoArray.map(m => {
              m.occurTime = util.formatDate(m.occurTime)
            })
            this.snapshotSqlData = res.data.sqlInfoArray
            this.snapshotSqlDataTotal = res.data.totalSize
          }
        })
        .always(res => {
          this.snapshotSqlloading = false
        })
    },
    getErrorSummaryData() {
      let oData = {
        condition: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          type: 2,
          size: 100
        }
      }
      let a = this.api.getlistRefinedSpanCallers({ data: oData })
      let b = this.api.getlistRefinedSpanDatabaseInstance({ data: oData })
      Promise.all([a, b]).then(res => {
        let callersData = res[0].data.map(m => {
          return {
            id: m,
            name: m
          }
        })
        let datbasesData = res[1].data.map(m => {
          return {
            id: m,
            name: m
          }
        })
        this.filterListData = [
          //            {
          //              text: '响应时间',
          //              type: 2,
          //              itemId: 'responsetime',
          //              disable: false,
          //            },
          {
            text: '操作命令',
            type: 1,
            disable: false,
            itemId: 'operations',
            listData: [
              { id: 'select', name: 'select' },
              { id: 'update', name: 'update' },
              {
                id: 'delete',
                name: 'delete'
              },
              { id: 'insert', name: 'insert' },
              { id: 'call', name: 'call' },
              { id: 'other', name: 'other' }
            ]
          },
          {
            text: '调用者',
            type: 1,
            disable: false,
            itemId: 'callers',
            listData: callersData
          },
          {
            text: '数据库实例',
            type: 1,
            disable: false,
            itemId: 'datbases',
            listData: datbasesData
          }
        ]
      })
    }
  }
}
</script>
