import util from '_util'
import {
  apdexConverter
} from '_cbl'
import FilterBarComplex from '_components/filter-bar/filter-bar-complex.vue'
import ChartLineBar from '_components/charts/chart-linebar.vue'
import ChartPie from '_components/charts/chart-pie-healthy.vue'
import {
  Pagination,
  Button,
  Table,
  TableColumn,
  Progress,
  Tabs,
  TabPane
} from 'element-ui'
import Topo from '_topo/topo'
import TopoLayout from '_topo/topo-layout'
import topBarQuery from '../../../../../components/mixin/topBarQuery'

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-progress': Progress,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-button': Button,
    'el-pagination': Pagination,
    Topo,
    ChartLineBar,
    ChartPie,
    FilterBarComplex
  },
  mixins: [topBarQuery],
  data() {
    return {
      curFRRowIndex: 999,
      curSBtn: true,
      secondShow: false,
      filterListData: [], // 过滤条传入的数据
      timeSection: {}, // 时间区间
      update: 0, // 拓补图需要
      topoData: {}, // 拓扑的数据
      snapshotList: [], // 快照列表
      attachmentSummary: {
        show: true,
        formatter: function(node) {
          let summary = []
          switch (node.type) {
            case 'USER':
              if (node.elapsedTime) {
                summary.push(`${node.elapsedTime} ms(100%)`)
              }
              if (node.error) {
                summary.push(`${node.error} errors`)
              }
              break
            case 'SERVER':
              if (node.elapsedTime) {
                summary.push(`${util.toDecimal(node.elapsedTime)} ms`)
              }
              let callCount = node.rpm
              summary.push(`${callCount} rpm`)
              if (node.epm) {
                summary.push(`${node.epm} epm`)
              }
              break
            default:
              break
          }
          return summary
        },
        position: 'left'
      },
      topFiveList: [{
        a: '',
        b: '/cart',
        c: '111ms'
      }, {
        a: '',
        b: '/cart',
        c: '111ms'
      }, {
        a: '',
        b: '/cart',
        c: '111ms'
      }, {
        a: '',
        b: '/cart',
        c: '111ms'
      }, {
        a: '',
        b: '/cart',
        c: '111ms'
      } ],
      errorsummary: {
        list: [],
        optionData: {}
      },
      chartDataBarDistribute: {},
      DataErr: {
        title: {}
      },
      componentName: '',
      percentageN: 0,
      performanceSummariesData: {
        percentArr: [0, 0, 0]
      },
      TransactiondiagramtopNcomponentsData: [{
        name: '',
        timeContributed: ''
      }, {
        name: '',
        timeContributed: ''
      }, {
        name: '',
        timeContributed: ''
      } ],
      TransactiondiagramtimecontributedData: {},
      TransactiondiagramtopNcallsData: [],
      TransactionsnaplistData: {
        list: [],
        total: 0
      },
      TransactionsnapsectionsData: {},
      TransactiondiagramreqcountsummaryData: {},
      TransactiondiagramreqcountsectionsummaryData: {
        errorReqCount: 0,
        normalReqCount: 0,
        slowReqCount: 0,
        veryslowReqCount: 0,
        total: 0,
        percent: [0, 0, 0, 0]
      },
      snapListindex: 0,
      sortField: 'responseTime',
      sortOrder: 'false',
      tabId: 0,
      snapListloading: true,
      topBarData: [], // top-bar 返回的数据
      fiterBarData: [] // 过滤条返回的数据
    }
  },
  computed: {
    transName() {
      return this.$route.query.transName
    },
    minResponseTime() {
      let responseTime = this.fiterBarData.find(m => m.itemId === 2)
      if (responseTime) {
        responseTime.infoData[0].val
      } else {
        return ''
      }
    },
    maxResponseTime() {
      let responseTime = this.fiterBarData.find(m => m.itemId === 2)
      if (responseTime) {
        responseTime.infoData[1].val
      } else {
        return ''
      }
    },
    transType() {
      return this.fiterBarData.find(m => m.itemId === 1) && this.fiterBarData.find(m => m.itemId === 1).infoData.map(m => m.value) || []
    },
    instanceArray() {
      return this.fiterBarData.find(m => m.itemId === 3) && this.fiterBarData.find(m => m.itemId === 3).infoData.map(m => m.value) || []
    }
  },
  mounted() {},
  watch: {
    componentName() {
      this.getTransactiondiagramtimecontributedData()
      this.getTransactiondiagramtopNcallsData()
    },
    percentageN() {
      this.getTransactiondiagramreqcountsummaryData()
      this.getTransactiondiagramreqcountsectionsummaryData()
    }
  },
  methods: {
    showSecondInfo(name, index) {
      if (!this.secondShow) {
        this.secondShow = true
      } else {
        this.secondShow = this.componentName !== name
      }
      this.curFRRowIndex = index
      this.componentName = name
    },
    tabClick(v) {
      let index = Number(v.index)
      switch (index) {
        case 0:
          this.tabId = index
          break
        case 1:
          this.tabId = index
          this.getTopoData()
          break
        case 2:
          this.tabId = index
          this.getTransactionsnapsectionsData()
          this.getTransactionsnaplistData()
          break
      }
    },
    goToNextPage(traceId) {
      this.$root.eventBus.openTab({
        name: traceId,
        options: {
          traceId: traceId,
          appId: this.$root.eventBus.getCurSystem().id || '',
          queryStr: this.transName
        }
      })
    },
    topbarChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      // this.componentName = ''
      this.getData()
    },
    filterbarChange(obj) {
      this.fiterBarData = obj
      // this.componentName = ''
      this.getData()
    },

    getData() {
      this.getFilterData()
      this.getPerformanceSummariesData()
      this.getTransactiondiagramtopNcomponentsData()
      this.getTransactiondiagramreqcountsummaryData()
      this.getTransactiondiagramreqcountsectionsummaryData()
      this.getTransactionerrorsummaryData()
      if (this.tabId === 1) this.getTopoData()
      if (this.tabId === 2) {
        this.getTransactionsnapsectionsData()
        this.getTransactionsnaplistData()
      }
    },
    snapSortChange(sortObj) {
      switch (sortObj.prop) {
        case 'elapsed':
          this.sortField = 'responseTime'
          break
        case 'startTime':
          this.sortField = 'startTime'
          break
      }

      switch (sortObj.order) {
        case 'ascending':
          this.sortOrder = 'true'
          break
        case 'descending':
          this.sortOrder = 'false'
          break
      }
      this.getTransactionsnaplistData()
    },
    getTransactionsnaplistData() {
      this.snapListloading = true
      this.api.getTransactionsnaplist({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          order: {
            field: this.sortField,
            asc: this.sortOrder
          },
          index: this.snapListindex,
          size: 10
        }
      }).then(res => {
        if (res.code === 0) {
          res.data.snapArray.map(m => {
            m.startTime = util.formatDate(m.startTime)
            let transType = m.transType || 'NORMAL'
            m.transClass = apdexConverter(transType).apdexIconClass
          })
          this.TransactionsnaplistData.list = res.data.snapArray
          this.TransactionsnaplistData.total = res.data.totalSize
        }
      }).always(res => {
        this.snapListloading = false
      })
    },
    getTransactionerrorsummaryData() {
      this.api.getTransactionerrorsummary({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          interval: this.interval,
          aggrInterval: this.aggrInterval,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray
        }
      }).then(res => {
        if (res.code === 0) {
          res.data.reqCountPieItemList.map(m => {
            m.finishTime = util.formatDate(m.finishTime)
            m.stringTime = util.formatDate(m.stringTime)
          })
          let list = res.data.reqCountPieItemList
          this.errorsummary.list = list
          this.errorsummary.optionData = {
            legend: {
              orient: 'vertical',
              x: '300',
              y: 'middle',
              data: list.map(m => m.error),
              formatter: function(name) {
                return name
              }
            },
            series: [{
              name: '错误',
              data: list.map(m => {
                return {
                  value: m.value,
                  name: m.error
                }
              })
            }]
          }
        }
      })
    },
    getTransactiondiagramreqcountsectionsummaryData() {
      this.api.getTransactiondiagramreqcountsectionsummary({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          interval: this.interval,
          appId: this.appId,
          aggrInterval: this.aggrInterval,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          percentageN: this.percentageN
        }
      }).then(res => {
        if (res.code === 0) {
          let percent = util.toPercentageP([
            res.data.normalReqCount || 0,
            res.data.slowReqCount || 0,
            res.data.veryslowReqCount || 0,
            res.data.errorReqCount || 0
          ])
          this.TransactiondiagramreqcountsectionsummaryData = {
            errorReqCount: res.data.errorReqCount || 0,
            normalReqCount: res.data.normalReqCount || 0,
            slowReqCount: res.data.slowReqCount || 0,
            veryslowReqCount: res.data.veryslowReqCount || 0,
            total: res.data.errorReqCount + res.data.normalReqCount + res.data.slowReqCount + res.data.veryslowReqCount,
            percent: percent
          }
        }
      })
    },
    getTransactiondiagramreqcountsummaryData() {
      this.api.getTransactiondiagramreqcountsummary({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          interval: this.interval,
          aggrInterval: this.aggrInterval,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          percentageN: this.percentageN
        }
      }).then(res => {
        if (res.code === 0) {
          let avgline = res.data.avgline
          let bar = res.data.bar

          this.TransactiondiagramreqcountsummaryData = {
            legend: {
              data: ['正常', '缓慢', '非常慢', '错误', '平均响应时间']
            },
            xAxis: [{
              data: bar.map(m => util.formatDate(m.time, 2))
            }],
            yAxis: [{
              type: 'value',
              name: '',
              axisLabel: {
                formatter: '{value} 次'
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
            series: [{
              name: '正常',
              type: 'bar',
              stack: '总量',
              data: bar.map(m => m.normalReqCount)
            },
            {
              name: '缓慢',
              type: 'bar',
              stack: '总量',
              data: bar.map(m => m.slowReqCount)
            },
            {
              name: '非常慢',
              type: 'bar',
              stack: '总量',
              data: bar.map(m => m.veryslowReqCount)
            },

            {
              name: '错误',
              type: 'bar',
              stack: '总量',
              data: bar.map(m => m.errorReqCount)
            },
            {
              name: '平均响应时间',
              type: 'line',
              yAxisIndex: 1,
              data: avgline.map(m => m.value)
            }
            ]
          }
        }
      })
    },
    getTransactionsnapsectionsData() {
      this.api.getTransactionsnapsections({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          responseTimeSectionArray: [{
            'min': 0,
            'max': 150
          },
          {
            'min': 150,
            'max': 250
          },
          {
            'min': 250,
            'max': 500
          },
          {
            'min': 500,
            'max': 1000
          },
          {
            'min': 1000,
            'max': 1500
          },
          {
            'min': 1500,
            'max': 2000
          },
          {
            'min': 2000,
            'max': 2500
          },
          {
            'min': 2500,
            'max': 3000
          },
          {
            'min': 3000,
            'max': 3000000
          }
          ]
        }
      }).then(res => {
        if (res.code === 0) {
          let list = res.data.responseTimeSectionArray
          let xArr = list.map((m, i) => {
            if (i === list.length - 1) {
              return m.timeSection.min + 'ms以上'
            } else {
              return m.timeSection.min + '-' + m.timeSection.max + 'ms'
            }
          })
          let yArr = list.map(m => m.numOfTrans)
          this.TransactionsnapsectionsData = {
            xAxis: [{
              type: 'category',
              data: ['错误', ...xArr]

            }],
            yAxis: [{
              type: 'value',
              name: '',
              axisLabel: {
                formatter: '{value} 次'
              }
            }],
            series: [{
              name: '',
              type: 'bar',

              data: [res.data.errorSection, ...yArr]
            }]
          }
        }
      })
    },
    getTransactiondiagramtopNcallsData() {
      this.api.getTransactiondiagramtopNcalls({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          componentName: this.componentName,
          topN: 5
        }
      }).then(res => {
        if (res.code === 0) {
          res.data.transArray.map(m => {
            let transType = m.transType || 'NORMAL'
            m.transClass = apdexConverter(transType).apdexIconClass
          })

          this.TransactiondiagramtopNcallsData = res.data.transArray
        }
      })
    },
    getTransactiondiagramtimecontributedData() {
      this.api.getTransactiondiagramtimecontributed({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          componentName: this.componentName
        }
      }).then(res => {
        if (res.code === 0) {
          res.data.perRate = ~~(res.data.timeContributed / this.performanceSummariesData.avgElapsed * 100)
          this.TransactiondiagramtimecontributedData = res.data
        }
      })
    },
    getTransactiondiagramtopNcomponentsData() {
      this.api.getTransactiondiagramtopNcomponents({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray,
          topN: 3
        }
      }).then(res => {
        if (res.code === 0 && res.data.componentArray.length > 0) {
          res.data.componentArray.map(m => {
            m.timeContributed = util.toDecimal(m.timeContributed)
          })
          res.data.componentArray.map(m => {
            m.timeContributed = util.toDecimal(m.timeContributed)
          })
          this.TransactiondiagramtopNcomponentsData = res.data.componentArray
        } else {
          this.TransactiondiagramtopNcomponentsData = [{
            name: '',
            timeContributed: ''
          }, {
            name: '',
            timeContributed: ''
          }, {
            name: '',
            timeContributed: ''
          } ]
        }
      })
    },
    getPerformanceSummariesData() {
      this.api.getPerformanceSummaries({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName,
          minResponseTime: this.minResponseTime,
          maxResponseTime: this.maxResponseTime,
          transType: this.transType,
          instanceArray: this.instanceArray
        }
      }).then(res => {
        if (res.code === 0) {
          let data = res.data
          if (data.avgCodeTime === 'NaN') data.avgCodeTime = 0
          if (data.avgDBTime === 'NaN') data.avgDBTime = 0
          if (data.avgElapsed === 'NaN') data.avgElapsed = 0
          if (data.avgThirdPartyTime === 'NaN') data.avgThirdPartyTime = 0
          let arr = [
            data.avgCodeTime,
            data.avgDBTime,
            data.avgThirdPartyTime
          ]
          res.data.percentArr = util.toPercentageP(arr)
          this.performanceSummariesData = res.data
        }
      })
    },
    getFilterData() {
      this.api.getFilterSummary({
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          appId: this.appId,
          transName: this.transName
        }

      }).then(res => {
        if (res.code === 0) {
          this.filterListData = [{
            text: '事务情况',
            disable: false,
            type: 1, // 1:多选框,2:时间范围
            itemId: 1,
            listData: [{
              name: '正常',
              id: 'NORMAL'
            },
            {
              name: '缓慢',
              id: 'SLOW'
            },
            {
              name: '非常慢',
              id: 'VERY_SLOW'
            },
            {
              name: '错误',
              id: 'ERROR'
            }
            ]
          },
          {
            text: '响应时间',
            type: 2,
            disable: false,
            itemId: 2
          }
            // {
            //   text: '实例',
            //   type: 1,
            //   disable: false,
            //   itemId: 3,
            //   listData: res.data.instanceArray
            // }
          ]
        }
      })
    },
    getTopoData() {
      let self = this
      this.api.getsecondtopology({
        data: {
          condition: {
            appId: this.appId,
            startTime: this.startTime,
            endTime: this.endTime,
            transName: this.transName
          }
        }
      }).then(res => {
        if (res.code === 0) {
          res.data.links.map((m, i) => {
            if (m.source.type === 'USER') { // 产品逻辑：把第一条线上的响应时间隐藏掉
              m.label = ''
            } else {
              m.label = m.elapsedTime + ' ms'
            }
          })
          res.data.nodes.map((m, i) => {
            if (m.type === 'USER') {
              m.elapsedTime = ''
            }

            // 节点颜色
            if (m.health) {
              m.status = [{
                value: 1,
                name: util.handleHealthy(m.health).Status
              }]
            } else {
              m.status = ''
            }
          })
          this.topoData = res.data
          let topoLayout = new TopoLayout()
          topoLayout.layout(
            $('.topo-box')[0],
            this.topoData
          )
          setTimeout(function() {
            self.update++
            console.log('outer update:' + self.update)
          }, 50)
        }
      })
    },
    TransactionsnaplistDataPageChange(i) {
      this.snapListindex = i - 1
      this.getTransactionsnaplistData()
    }
  }
}
