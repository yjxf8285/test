<template>
  <div class="dashboard">
    <top-bar title="仪表盘" @barChange="barChange"></top-bar>
    <div class="first-section">
      <div class="l" :style="{height:topoHeight+'px'}">
        <div class="topo-box" :style="{height:topoHeight+'px'}">
          <topo
            :data="topoData"
            :update="update"
            :attachmentSummary="attachmentSummary"
          >
          </topo>
          <el-button @click="showLegendImg=!showLegendImg" type="primary" size="mini" class="legend-btn">
            <i class="icon ion-android-apps" style="font-size: 16px;"></i><span style="font-size: 12px;"> 图例</span>
          </el-button>
          <div class="legend-img" v-show="showLegendImg"></div>
        </div>
      </div>
      <div class="r">
        <div class="common-container r-box" :style="{height:topoHeight+'px'}">
          <div class="header-title">
            <i class="title-icon icon ion-stats-bars"></i>
            <span class="title-name">统计</span>
          </div>
          <div class="info-box-wrap" :style="{height:topoHeight-52+'px'}">
            <div class="info-box">
              <div class="title-base">节点健康</div>
              <div class="chart-box">
                <PercentBar :barData="indicatorData.h.perventData"></PercentBar>
                <div class="text-area">
                  <span>健康：{{indicatorData.h.countData[0]}}；一般：{{indicatorData.h.countData[1]}}；不容忍：{{indicatorData.h.countData[2]}}</span>
                </div>
              </div>
            </div>
            <div class="info-box">
              <div class="title-base">事务健康</div>
              <div class="chart-box">
                <PercentBar :barData="indicatorData.t.perventData"></PercentBar>
                <div class="text-area">
                  <span>健康：{{indicatorData.t.countData[0]}}；一般：{{indicatorData.t.countData[1]}}；不容忍：{{indicatorData.t.countData[2]}}</span>
                </div>
              </div>
            </div>
            <div class="info-box" style="border: none">
              <div class="title-base">用户体验</div>
              <div class="chart-box">
                <PercentBar :barData="indicatorData.u.perventData"></PercentBar>
                <div class="text-area">
                  <span>正常：{{indicatorData.u.countData[0]}} %；缓慢：{{indicatorData.u.countData[1]}} %；非常慢：{{indicatorData.u.countData[2]}} %; 错误：{{indicatorData.u.countData[3]}} %</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="bottom-charts">
      <div class="l">
        <div class="common-container item-chart">

          <div class="header-title">
            <span class="title-name">响应时间(ms)：{{chartDataResponse.avgResponseTime}}</span>
            <div class="right-info">
              <span>Apdex：{{chartDataResponse.apdex}} </span>
            </div>
          </div>
          <div class="chart-warp">
            <ChartAreaGraph :optionData="chartDataResponse.optionData"></ChartAreaGraph>
          </div>
        </div>

        <div class="common-container item-chart">
          <div class="header-title">
            <span class="title-name">请求数：{{chartDataThroughput.requestCount}}</span>
            <div class="right-info">
              <span>{{chartDataThroughput.rpm}} rpm</span>
            </div>
          </div>
          <div class="chart-warp">
            <ChartAreaGraph :optionData="chartDataThroughput.optionData"></ChartAreaGraph>
          </div>
        </div>

      </div>
      <div class="r">
        <div class="common-container item-chart">
          <div class="header-title">
            <span>错误数：{{chartDataError.errorCount}} </span>
            <span class="fc-red ml40">{{chartDataError.errorRate}}%</span>
            <div class="right-info">
              <span>{{chartDataError.epm}} epm</span>
            </div>
          </div>
          <div class="chart-warp">
            <ChartAreaGraph :optionData="chartDataError.optionData"></ChartAreaGraph>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  /* eslint-disable space-before-function-paren */
  import {Button} from 'element-ui'
  import util from '../../../../util'
  import Topo from '_topo/topo'
  import TopoLayout from '_topo/topo-layout'
  import PercentBar from '../../../../components/ui-mod/percent-bar.vue'
  import ChartAreaGraph from '../../../../components/charts/chart-area-graph.vue'
  import topBarQuery from '../../../../components/mixin/topBarQuery'

  export default {
    components: {'el-button': Button, ChartAreaGraph, PercentBar, Topo},
    mixins: [topBarQuery],
    data() {
      return {
        showLegendImg: false,
        attachmentSummary: {
          show: true,
          formatter: function (node) {
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
        update: 0,
        topoData: {},
        topoHeight: '400px',
        indicatorData: {
          h: {
            countData: [0, 0, 0],
            perventData: [0, 0, 0]
          },
          t: {
            countData: [0, 0, 0],
            perventData: [0, 0, 0]
          },
          u: {
            countData: [0, 0, 0, 0],
            perventData: [0, 0, 0, 0]
          }
        },
        chartDataResponse: {
          avgResponseTime: 0,
          apdex: 0,
          optionData: {}
        },
        chartDataThroughput: {
          requestCount: 0,
          rpm: 0,
          optionData: {}
        },
        chartDataError: {
          errorCount: 0,
          epm: 0,
          optionData: {}
        }
      }
    },
    computed: {},
    mounted() {
      this.fixTopoHeight()
      $(window).on('resize', this.fixTopoHeight)
    },
    methods: {
      barChange(queryData) {
        this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
        this.getDashboardIndicatorData()
        this.getDashboardresponsetimetrendData()
        this.getDashboardresponthroughputtrendData()
        this.getDashboarderrorcounttrendData()
        this.getTopoData()
      },
      fixTopoHeight() {
        let containerH = $('.main-content').height()
        let bottomChartsH = $('.bottom-charts').height()
        let filterBarH = $('.filter-bar').height()
        let minHeight = 400
        let finalH = containerH - bottomChartsH - filterBarH - 24 * 4 - 56
        if (finalH < minHeight) finalH = minHeight
        this.topoHeight = finalH
      },
      getDashboarderrorcounttrendData() {
        this.api
          .getDashboarderrorcounttrend({
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
          .then(res => {
            if (res.code === 0) {
              let list = res.data.errorCountTrendRows || []
              let xData = list.map(m => util.formatDate(m.time, 2))
              let yData = list.map(m => m.errorCount)
              if (xData.length <= 0) {
                this.chartDataError.optionData = {}
              } else {
                this.chartDataError = {
                  errorCount: res.data.errorCount,
                  epm: util.toDecimal(res.data.epm),
                  errorRate: util.toDecimal(res.data.errorRate) || 0,
                  optionData: {
                    formatter: function (params, ticket, callback) {
                      let formatStr = ''
                      params.map(m => {
                        let curItem = list[m.dataIndex]
                        // 标题、时间、错误数、错误／分钟、请求数
                        if (curItem) {
                          formatStr = `
                      标题：${curItem.title}<br>
                      时间：${util.formatDate(curItem.time, 2)}<br>
                      错误数：${curItem.errorCount}<br>
                      错误／分钟：${util.toDecimal(curItem.epm)}<br>
                      请求次数：${curItem.requestCount}<br>
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
              }
            }
          })
      },
      getDashboardresponthroughputtrendData() {
        this.api
          .getDashboardresponthroughputtrend({
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
          .then(res => {
            if (res.code === 0) {
              let list = res.data.throughputTrendRows || []
              let xData = list.map(m => util.formatDate(m.time, 2))
              let yData = list.map(m => m.rpm)
              if (xData.length <= 0) {
                this.chartDataThroughput.optionData = {}
              } else {
                this.chartDataThroughput = {
                  requestCount: res.data.requestCount,
                  rpm: util.toDecimal(res.data.rpm),
                  optionData: {
                    formatter: function (params, ticket, callback) {
                      let formatStr = ''
                      params.map(m => {
                        let curItem = list[m.dataIndex]
                        // 标题、时间、吞吐率、请求数 （吞吐率：每分钟请求数）
                        if (curItem) {
                          formatStr = `
                      标题：${curItem.title}<br>
                      时间：${util.formatDate(curItem.time, 2)}<br>
                      吞吐率：${curItem.rpm}<br>
                      请求次数：${curItem.requestCount}<br>
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
              }
            }
          })
      },
      getDashboardresponsetimetrendData() {
        this.api
          .getDashboardresponsetimetrend({
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
          .then(res => {
            if (res.code === 0) {
              let list = res.data.responseTimeTrendRowList || []
              let p90list = res.data.p90TrendRowList || []
              let xData = list.map(m => util.formatDate(m.time, 2))
              let yData = list.map(m => m.responseTime)
              let p90yData = p90list.map(m => m.p90Time)
              if (xData.length <= 0) {
                this.chartDataResponse.optionData = {}
              } else {
                this.chartDataResponse = {
                  avgResponseTime: res.data.avgResponseTime,
                  apdex: res.data.apdex,
                  optionData: {
                    formatter: function (params, ticket, callback) {
                      let formatStr = ''
                      let m = params[0]
                      let n = params[1]
                      let curItem = list[m.dataIndex]
                      let p90Time = p90yData[n.dataIndex]
                        // 标题、时间、响应时间、P90响应时间、最大值、最小值、请求次数
                      if (curItem) {
                        formatStr = `
                      标题：${curItem.title}<br>
                      时间：${util.formatDate(curItem.time, 2)}<br>
                      平均响应时间：${curItem.responseTime}<br>
                      P90响应时间：${p90Time}<br>
                      最大值：${curItem.maxResponseTime}<br>
                      最小值：${curItem.minResponseTime}<br>
                      请求次数：${curItem.requestCount}<br>
                      `
                        return formatStr
                      }
                    },
                    xAxis: {
                      data: xData
                    },
                    series: [
                      {
                        data: yData
                      },
                      {
                        type: 'line',
                        itemStyle: {
                          normal: {
                            color: '#f38211'
                          }
                        },
                        areaStyle: {
                          normal: {
                            opacity: 0
                          }
                        },
                        data: p90yData
                      }
                    ]
                  }
                }
              }
            }
          })
      },
      getDashboardIndicatorData() {
        this.api
          .getDashboardIndicator({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime
              }
            }
          })
          .then(res => {
            if (res.code === 0) {
              let h =
                res.data.dashboardNodeHealthIndicator
                  .dashboardNodeHealthIndicatorPair

              let hp = util.toPercentageP([
                h.healthyCount,
                h.normalCount,
                h.intoleranceCount
              ])
              let t =
                res.data.dashboardTransactionHealthIndicator
                  .dashboardTransactionHealthIndicatorPair
              let tp = util.toPercentageP([
                t.healthyCount,
                t.normalCount,
                t.intoleranceCount
              ])
              let u =
                res.data.dashboardUserExperienceIndicator
                  .dashboardUserExperienceIndicatorPair
              let up = [
                u.normalCountProportion,
                u.slowCountProportion,
                u.verySlowProportion,
                u.errorProportion
              ]
              this.indicatorData = {
                h: {
                  countData: [h.healthyCount, h.normalCount, h.intoleranceCount],
                  perventData: hp
                },
                t: {
                  countData: [t.healthyCount, t.normalCount, t.intoleranceCount],
                  perventData: tp
                },
                u: {
                  countData: [
                    u.normalCountProportion,
                    u.slowCountProportion,
                    u.verySlowProportion,
                    u.errorProportion
                  ],
                  perventData: up
                }
              }
            }
          })
      },
      getTopoData() {
        let self = this
        this.api
          .getdashboardtopology({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime
              }
            }
          })
          .then(res => {
            if (res.code === 0) {
              res.data.links.map((m, i) => {
                if (m.source.type === 'USER') {
                  // 产品逻辑：把user类型的线上的数据隐藏掉
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
                  m.status = [
                    {value: 1, name: util.handleHealthy(m.health).Status}
                  ]
                }
              })
              this.topoData = res.data
              let topoLayout = new TopoLayout()
              topoLayout.layout($('.topo-box')[0], this.topoData)

              setTimeout(function () {
                self.update++
              }, 50)
            }
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~vars";

  $green: #5bd4c7;
  $orange: #ffcc99;
  $red: #ff1f1f;
  .dashboard {
    padding-bottom: 10px;
    .first-section {
      display: flex;
      .l {
        flex: 1;
        margin-right: 24px;
      }
      .r {
        width: 33.4%;
        .r-box {
          margin: 24px 24px 24px 0;
        }
        .info-box-wrap {
          height: 100%;
          display: flex;
          flex-direction: column;

        }
        .info-box {
          flex: 1;
          border-bottom: $border;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .title-base {
            font-size: 14px;
            padding-bottom: 10px;
          }
          .chart-area {
            display: flex;
            .item-bar {

              height: 12px;
              background: $red;
              &.green-bar {
                background: $green;
              }
              &.orange-bar {
                background: $orange;
              }
              &.red-bar {
                background: $red;
              }
            }
          }
          .text-area {
            margin-top: 6px;
          }
        }
      }
    }

    .topo-box {
      margin: 24px;
      margin-right: 0;
      background: #fff;
      border: $border;
      position: relative;
      .legend-btn {
        position: absolute;
        right: 10px;
        bottom: 10px;
        padding: 3px 8px;
        * {
          vertical-align: middle;
        }
      }
      .legend-img {
        border: none;
        position: absolute;
        right: 65px;
        bottom: 0px;
        width: 359px;
        height: 210px;
        background: url("../../../../assets/images/tuli.png");
      }
    }
    .bottom-charts {
      margin-left: 24px;
      display: flex;
      .l {
        flex: 1;
        display: flex;
      }
      .r {
        width: 34%;
      }
      .item-chart {
        margin: 0 24px 0 0;
        background: #fff;
        flex: 1;
        border: $border;
        .chart-warp {
          padding-top: 20px;
          height: 180px;
        }
      }
    }
  }
</style>
