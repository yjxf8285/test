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
    <top-bar title="错误率" @barChange="topbarChange"></top-bar>
    <FilterBarComplex  :filterList="filterListData" style="margin-top: 1px"
                      @fbarChange="filterbarChange"></FilterBarComplex>
    <div class="common-container multiple">
      <div class="l">
        <div class="header-title">
          <i class="title-icon icon ion-podium"></i>
          <span class="title-name">错误数趋势</span>
          <div class="right-info">
            <span>{{errorSectionsOverview.errorNum}} 次</span>
            <span>{{errorSectionsOverview.errorPerMinute}} 错误/分钟</span>
          </div>
        </div>
        <div class="content">
          <div class="chart-wrap">
            <ChartAreaGraph :optionData="errorSectionsOption"></ChartAreaGraph>
          </div>
        </div>
      </div>
      <div class="r">
        <div class="header-title" style="border-left:solid 1px #dcdcdc;">
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
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">错误列表</span>
        <el-input placeholder="请输入名称"  size="small" class="search-input" v-model="searchName"
                  @change="handleSearchErrList"></el-input>
      </div>
      <div class="content">
        <el-table :data="errListData" @sort-change="sortChange" v-loading="errorListloading">
          <el-table-column prop="name" label="事务">
            <template slot-scope="scope">
              <a class="theme-font-color-primary"
                 href="javascript:void(0);"
                 @click="goToNextPage(scope.row.traceId,scope.row.name)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="发生时间" sortable="custom"></el-table-column>
          <el-table-column prop="errorName" label="错误类型"></el-table-column>
          <el-table-column prop="tierName" label="Tier"></el-table-column>
          <el-table-column prop="instance" label="实例"></el-table-column>
        </el-table>
        <div class="pag-wrap">
          <el-pagination
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="10"
            :total="errListDataTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import ChartAreaGraph from '../../../../../components/charts/chart-area-graph.vue'
import ChartPie from '../../../../../components/charts/chart-pie-healthy.vue'
import {
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
  components: {
    ChartPie,
    ChartAreaGraph,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-table': Table,
    'el-tooltip': Tooltip,
    'el-table-column': TableColumn,
    'el-button': Button
  },
  mixins: [topBarQuery],
  mounted() {},
  data() {
    return {
      searchName: '',
      errListData: [],
      errListDataTotal: 0,
      pageIndex: 0,
      errorListloading: true,
      sortField: 'startTime',
      sortOrder: 'desc',
      topNErrorOption: {},
      errorSectionsOption: {},
      errorSectionsOverview: {
        errorNum: 0,
        errorPerMinute: 0
      },
      topBarData: [],
      fiterBarData: [],
      filterListData: []
    }
  },
  computed: {
    errorArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'errorArray') &&
          this.fiterBarData
            .find(m => m.itemId === 'errorArray')
            .infoData.map(m => m.value)) ||
        []
      )
    },
    instanceArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'instanceArray') &&
          this.fiterBarData
            .find(m => m.itemId === 'instanceArray')
            .infoData.map(m => m.value)) ||
        []
      )
    }
  },
  methods: {
    topbarChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.getErrorSummaryData()
      this.getErrorListData()
      this.getErrorSectionsData()
      this.getErrorTopNData()
    },
    filterbarChange(query) {
      this.fiterBarData = query
      this.getErrorListData()
      this.getErrorSectionsData()
      this.getErrorTopNData()
    },
    handleSearchErrList() {
      this.getErrorListData()
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
    handleCurrentChange(i) {
      this.pageIndex = i - 1
      this.getErrorListData()
    },
    sortChange(sortObj) {
      this.sortField = sortObj.prop || 'startTime'
      if (sortObj.order === 'ascending') this.sortOrder = 'asc'
      if (sortObj.order === 'descending') this.sortOrder = 'desc'
      this.getErrorListData()
    },
    getErrorSummaryData() {
      this.api
        .getErrorSummary({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId
            }
          }
        })
        .then(res => {
          if (res.code === 0) {
            let errorArrayData = res.data.errorArray.map(m => {
              return {
                id: m,
                name: m
              }
            })
            this.filterListData = [
              {
                text: '错误类型',
                type: 1,
                disable: false,
                itemId: 'errorArray',
                listData: errorArrayData
              },
              {
                text: '实例',
                type: 1,
                disable: false,
                itemId: 'instanceArray',
                listData: res.data.instanceArray
              }
            ]
          }
        })
    },
    getErrorListData() {
      this.errorListloading = true
      this.api
        .getErrorList({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              searchKey: this.searchName,
              instanceArray: this.instanceArray,
              errorArray: this.errorArray
            },
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
          if (res.code === 0) {
            res.data.errorArray.map(m => {
              m.startTime = util.formatDate(m.startTime)
            })
            this.errListData = res.data.errorArray
            this.errListDataTotal = res.data.totalSize
          }
        })
        .always(res => {
          this.errorListloading = false
        })
    },
    getErrorSectionsData() {
      this.api
        .getErrorSections({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              granularity: this.aggrInterval,
              instanceArray: this.instanceArray,
              errorArray: this.errorArray
            }
          }
        })
        .then(res => {
          if (res.code === 0) {
            this.errorSectionsOverview = {
              errorNum: res.data.overview.errorNum,
              errorPerMinute: res.data.overview.errorPerMinute
            }
            let list = res.data.sectionArray || []
            let xData = list.map(m => util.formatDate(m.startTime, 2))
            let yData = list.map(m => m.errorNum)
            this.errorSectionsOption = {
              formatter: function(params, ticket, callback) {
                let formatStr = ''
                params.map(m => {
                  let curItem = list[m.dataIndex]
                  // 标题、时间、错误数、请求数
                  if (curItem) {
                    formatStr = `
                      标题：错误<br>
                      时间：${util.formatDate(curItem.startTime, 2)}<br>
                      错误数：${curItem.errorNum}<br>
                      错误/分钟：${curItem.errorPerMinute}<br>
                      `
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
    getErrorTopNData() {
      this.api
        .getErrorTopN({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId,
              instanceArray: this.instanceArray,
              errorArray: this.errorArray
            },
            topN: 5
          }
        })
        .then(res => {
          if (res.code === 0) {
            let list = []
            if (res.data.otherError > 0) {
              list = [
                ...res.data.topNErrorArray,
                {
                  num: res.data.otherError,
                  name: '其他'
                }
              ]
            } else {
              list = res.data.topNErrorArray
            }
            this.topNErrorOption = {
              legend: {
                orient: 'vertical',
                x: '340',
                y: 'middle',
                data: list.map(m => m.name),
                formatter: function(name) {
                  return name
                }
              },
              series: [
                {
                  name: '错误信息',
                  data: list.map(m => {
                    return {
                      value: m.num,
                      name: m.name
                    }
                  })
                }
              ]
            }
          }
        })
    }
  }
}
</script>
