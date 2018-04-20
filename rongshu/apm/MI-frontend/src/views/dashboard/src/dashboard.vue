<style lang="scss" scoped>
  @import "~vars";
  .dashboard {
    height: 100%;
    // padding: 20px;
  }
  .app-info {
    padding-right: 20px;
  }
  .info-grid {
    // padding: 10px;
    padding: 20px 0 20px 20px;
  }
  .info-panel {
    border-width: 1px;
    border-style: solid;
    h3 {
      height: 42px;
      padding: 0 10px;
      line-height: 40px;
      border-bottom-width: 2px;
      border-bottom-style: solid;
      font-size: $small;
      .au-icon {
        font-size: $normal;
      }
      text-align: center;
    }
    p {
      height: 78px;
      padding: 0 10px;
      font-size: $large;
      line-height: 78px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .charts {}
  .chart-grid {
    padding: 0 20px 20px 20px;
  }
</style>
<template>
  <au-scroller class="dashboard au-theme-font-color--base-3">
    <div class="app-info">
      <au-grid class="info-grid" width-sm="6" width-md="4" width-lg="2">
        <div class="info-panel au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--success-3">
            <au-icon type="eye"/>
            平均响应时间
          </h3>
          <p>{{ summary.avgResponseTime }} 毫秒</p>
        </div>
      </au-grid>
      <au-grid class="info-grid" width-sm="6" width-md="4" width-lg="2">
        <div class="info-panel au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--success-3">
            <au-icon type="user"/>
            活跃用户数
          </h3>
          <p>{{ summary.activeUsers}} 人</p>
        </div>
      </au-grid>
      <au-grid class="info-grid" width-sm="6" width-md="4" width-lg="2">
        <div class="info-panel au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--success-3">
            <au-icon type="user"/>
            请求次数
          </h3>
          <p>{{ summary.requestTimes }} 次</p>
        </div>
      </au-grid>
      <au-grid class="info-grid" width-sm="6" width-md="4" width-lg="2">
        <div class="info-panel au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--success-3">
            <au-icon type="user"/>
            吞吐率
          </h3>
          <p>{{ summary.throughputRate }} rpm</p>
        </div>
      </au-grid>
      <au-grid class="info-grid" width-sm="6" width-md="4" width-lg="2">
        <div class="info-panel au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--success-3">
            <au-icon type="user"/>
            HTTP错误
          </h3>
          <p>{{ summary.httpError }}</p>
        </div>
      </au-grid>
      <au-grid class="info-grid" width-sm="6" width-md="4" width-lg="2">
        <div class="info-panel au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--success-3">
            <au-icon type="user"/>
            网络失败
          </h3>
          <p>{{ summary.networkError }}</p>
        </div>
      </au-grid>
    </div>
    <div class="charts">
      <au-grid class="chart-grid" width-xs="12">
        <chart-category-bar :data="responseTimeDiagram" :mark-point="responseTimeDiagramMarkPoint" title="响应时间分布"/>
      </au-grid>
      <au-grid class="chart-grid" width-d="12" width-lg="4" >
        <chart-line-bar type="line" :data="chartsData.responseTimeSection" title="响应时间趋势(ms)"/>
      </au-grid>
      <au-grid class="chart-grid" width-md="12" width-lg="4">
        <chart-line-bar type="line" :data="chartsData.requestTimesSection" title="请求次数趋势(次)"/>
      </au-grid>
      <au-grid class="chart-grid" width-md="12" width-lg="4">
        <chart-line-bar type="line" :data="fakeData.data" title="HTTP错误&网络错误趋势(--fake--)"/>
      </au-grid>
      <au-grid class="chart-grid" width-md="12" width-lg="6">
        <chart-pie :data="chartsData.topnHttpError" title="HTTP错误比例"/>
      </au-grid>
      <au-grid class="chart-grid" width-md="12" width-lg="6">
        <chart-pie :data="chartsData.topnNetworksError" title="网络失败错误比例"/>
      </au-grid>
    </div>
  </au-scroller>
</template>

<script>
  import ChartLineBar from '_commons/charts/chart-line-bar.vue'
  import ChartCategoryBar from '_commons/charts/chart-category-bar.vue'
  import ChartPie from '_commons/charts/chart-pie.vue'
  import store from '_store'

  export default {
    components: { ChartLineBar, ChartPie, ChartCategoryBar },
    data () {
      return {
        fakeData: {
          code: 0,
          message: 'success',
          data: [
            {
              'name': '响应时间趋势图',
              'list': [
                {
                  'x': 1511783400000,
                  'y': '0.2'
                },
                {
                  'x': 1511784400000,
                  'y': '0.6'
                },
                {
                  'x': 1511785400000,
                  'y': '1.3'
                },
                {
                  'x': 1511786400000,
                  'y': '0.7'
                },
                {
                  'x': 1511787400000,
                  'y': '0.5'
                },
                {
                  'x': 1511788400000,
                  'y': '0.9'
                }
              ]
            },
            {
              'name': '响应时间趋势图s',
              'list': [
                {
                  'x': 1511783400000,
                  'y': '0.2'
                },
                {
                  'x': 1511784400000,
                  'y': '0.6'
                },
                {
                  'x': 1511785400000,
                  'y': '1.3'
                },
                {
                  'x': 1511786400000,
                  'y': '0.7'
                },
                {
                  'x': 1511787400000,
                  'y': '0.5'
                },
                {
                  'x': 1511788400000,
                  'y': '0.9'
                }
              ]
            }
          ]
        },
        fakePieData: {
          code: 0,
          message: 'success',
          data: [
            {value: 335, name: '直接访问'},
            {value: 310, name: '邮件营销'},
            {value: 234, name: '联盟广告'},
            {value: 135, name: '视频广告'},
            {value: 1548, name: '搜索引擎'}
          ]
        },
        chartsData: { // 需要与model中的dashboard中的接口名同名（除了get前缀）
          responseTimeSection: [],
          requestTimesSection: [],
          topnHttpError: {},
          topnNetworksError: {}
        },
        // real
        summary: {
          avgResponseTime: '--',
          requestTimes: '--',
          httpError: '--',
          activeUsers: '--',
          throughputRate: '--',
          networkError: '--'
        },
        responseTimeDiagram: [],
        responseTimeDiagramMarkPoint: []
      }
    },
    watch: {
      appInfo: {
        deep: true,
        handle (v) {
          if (v) {
            this.convertAppInfo()
          }
        }
      }
    },
    mounted () {
      if (store.ready) this.getAll(store.getConditions())
      store.$on('change', this.getAll)
    },
    destroyed () {
      store.$off('change', this.getAllChartsData)
    },
    computed: {},
    methods: {
      getQueries (conditions) {
        return {
          appId: conditions.app.appId,
          appVersion: conditions.version,
          granularity: conditions.granularity,
          ...conditions.timespan,
          topN: 5
        }
      },
      getSummary (conditions) {
        let vm = this
        vm.api.getSummary({
          data: {
            condition: vm.getQueries(conditions)
          }
        }).then(res => {
          if (res) {
            vm.summary = res.data || {
              avgResponseTime: '--',
              requestTimes: '--',
              httpError: '--',
              activeUsers: '--',
              throughputRate: '--',
              networkError: '--'
            }
          }
        })
      },
      getResponseTimeDiagram (conditions) {
        let vm = this
        vm.api.getResponseTimeDiagram({
          data: {
            condition: vm.getQueries(conditions)
          }
        }).then(res => {
          if (res) {
            if (res.data && res.data.statArray) {
              vm.responseTimeDiagram = res.data.statArray.map(e => {
                return {
                  x: e.startTime + '-' + (e.endTime || '以上') + 'ms',
                  y: e.requestTimes
                }
              })
              vm.responseTimeDiagramMarkPoint = []
              if (res.data.p50startTime + '') {
                vm.responseTimeDiagramMarkPoint.push(vm.getMarkPoint(res.data.p50startTime, res.data.statArray))
              }
              if (res.data.p90startTime + '') {
                vm.responseTimeDiagramMarkPoint.push(vm.getMarkPoint(res.data.p90startTime, res.data.statArray))
              }
              if (res.data.p95startTime + '') {
                vm.responseTimeDiagramMarkPoint.push(vm.getMarkPoint(res.data.p95startTime, res.data.statArray))
              }
            } else {
              vm.responseTimeDiagram = []
              vm.responseTimeDiagramMarkPoint = []
            }
          } else {
            vm.responseTimeDiagram = []
            vm.responseTimeDiagramMarkPoint = []
          }
        })
      },
      getMarkPoint (value, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].startTime === value) return i
        }
      },
      getAll (conditions) {
        this.getSummary(conditions)
        this.getResponseTimeDiagram(conditions)
      }
    }
  }
</script>
