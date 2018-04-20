<style lang="scss" scoped>
  @import '~vars';
  .network-request {
    height: 100%;
    user-select: text;
  }
  .network-request:after {
    content: "";
    display: block;
    clear: both;
  }
  .left-container {
    position: relative;
    float: left;
    width: 360px;
    height: 100%;
    padding: 93px 10px 10px 20px;
    border-right-width: 1px;
    border-right-style: solid;
    font-size: $normal;
    .filter-bar {
      position: absolute;
      top: 15px;
      left: 0;
      width: 100%;
      padding: 0 10px 0 20px;
      // text-align: right;
    }
    .sort-select {
      // margin: 0 5px;
      width: 295px;
      vertical-align: middle;
    }
    .search-input {
      width: 100%;
    }
    .sort-key {
      display: inline-block;
      margin-top: 10px;
      margin-right: 10px;
    }
    .list-container {
      height: 100%;
      border-top-width: 1px;
      border-top-style: solid;
    }
    .list {
      padding-bottom: 10px;
    }
    .item {
      position: relative;
      padding: 5px;
      margin: 10px 0;
      padding-left: 5px;
      border-left-width: 4px;
      border-left-style: solid;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      .rate-bg {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        height: 100%;
      }
      .item-text {
        position: relative;
        z-index: 2;
      }
      .item-num {
        position: absolute;
        top: 0;
        right: 5px;
        z-index: 3;
        height: 100%;
        line-height: 26px;
      }
    }
  }
  .sort-popover {
    padding: 5px;
    font-size: $small;
  }
  .right-container {
    height: 100%;
    overflow-x: auto;
    .overview-bar {
      padding-top: 10px;
      padding-bottom: 5px;
      padding-right: 20px;
    }
    // .overview-bar:after {
    //   content: "";
    //   display: block;
    //   width: 100%;
    //   margin-left: 10px;
    //   border-bottom-width: 1px;
    //   border-bottom-style: solid;
    // }
    .overview-grid {
      padding: 5px 0 5px 10px;
    }
    .overview-item {
      width: 100%;
      .overview-name,
      .overview-value {
        height: 100%;
        padding: 0 10px;
        text-align: center;
      }
      .overview-name {
        height: 32px;
        line-height: 32px;
        font-size: $normal;
      }
      .overview-value {
        border-width: 1px;
        border-style: solid;
        font-size: $large;
        line-height: 40px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .charts-container {
      padding-bottom: 5px;
      padding-right: 19px;
    }
    .chart-grid {
      padding: 0 0 10px 10px;
    }
  }
</style>
<template>
  <div class="network-request au-theme-font-color--base-3">
    <div class="left-container au-theme-border-color--base-8">
      <div class="filter-bar">
        <au-input class="search-input" v-model="searchKey" icon="search" icon-position="right"/>
        <!-- 排序字段： <au-select class="sort-select" :options="[
          {
            text: '响应时间',
            value: 'responseTime',
          },
          {
            text: '吞吐率',
            value: 'throughput',
          },
          {
            text: '请求数',
            value: 'requestTimes',
          }
        ]" label="" v-model="sortKey"/> -->
        <au-popover v-for="(sortKey, index) in sortKeys" placement="top left" :key="sortKey">
          <au-button slot="target" type="warning" size="small" :plain="sortKey !== currentSortKey" class="
            sort-key
            au-theme-radius
            au-theme-border-color--base-8
          " @click="pickSortKey(sortKey)">{{ sortKey }}</au-button>
          <div slot="content" class="sort-popover">按{{ sortKey }}排序</div>
        </au-popover>
      </div>
      <au-scroller class="list-container au-theme-border-color--base-8">
        <ul class="list">
          <li
            v-for="(domain, index) in domainList"
            :key="index"
            @click="currentDomain = domain"
            class="
            item
            au-theme-border-color--primary-5
            au-theme-hover-font-color--primary-3
            au-theme-hover-border-color--primary-3">
            <span class="rate-bg au-theme-background-color--info-5" :style="{ width: getBgWidth(domain) }"></span>
            <span class="item-text">{{ domain.name }}</span>
            <span class="item-num">{{ getListNum(domain) }}</span>
          </li>
        </ul>
      </au-scroller>
    </div>
    <au-scroller class="right-container">
      <div class="overview-bar au-theme-after-border-color--base-8">
        <au-grid class="overview-grid" :width-lg="overviewItemWidth">
          <div class="overview-item">
            <div class="overview-name au-theme-font-color--base-12 au-theme-background-color--success-3">错误率</div>
            <div class="overview-value au-theme-border-color--base-8">23.2%(123/12345)</div>
          </div>
        </au-grid>
        <au-grid class="overview-grid" :width-lg="overviewItemWidth">
          <div class="overview-item">
            <div class="overview-name au-theme-font-color--base-12 au-theme-background-color--success-3">错误／分钟</div>
            <div class="overview-value au-theme-border-color--base-8">12.3 epm</div>
          </div>
        </au-grid>
        <au-grid class="overview-grid" :width-lg="overviewItemWidth">
          <div class="overview-item">
            <div class="overview-name au-theme-font-color--base-12 au-theme-background-color--success-3">HTTP错误率</div>
            <div class="overview-value au-theme-border-color--base-8">12.8%</div>
          </div>
        </au-grid>
        <au-grid class="overview-grid" :width-lg="overviewItemWidth">
          <div class="overview-item">
            <div class="overview-name au-theme-font-color--base-12 au-theme-background-color--success-3">网络失败率</div>
            <div class="overview-value au-theme-border-color--base-8">12.8%</div>
          </div>
        </au-grid>
      </div>
      <div class="charts-container">
        <au-grid class="chart-grid" width-lg="12">
          <chart-line-bar type="bar" title="响应时间分布" :data="responseTime"/>
        </au-grid>
        <au-grid class="chart-grid" width-lg="12">
          <chart-line-bar title="响应时间和请求次数趋势" :data="responseTimeAndRequestTime" :structure-map="rtrtStructureMap"/>
        </au-grid>
        <au-grid class="chart-grid" width-lg="12">
          <div style="height: 100px; text-align: center; line-height: 100px; font-size: 50px;" class="au-theme-background-color--warning-3 au-theme-font-color--base-12">// TODO: 地图占位！！！</div>
        </au-grid>
        <au-grid class="chart-grid" :width-lg="chartItemWidth">
          <topn-bar title="运营商平均响应时间倒序条形图" :data="OperatorsAvgResponseTime"/>
        </au-grid>
        <au-grid class="chart-grid" :width-lg="chartItemWidth">
          <topn-bar title="接入方式平均响应时间倒序条形图" :data="OperatorsAvgResponseTime"/>
        </au-grid>
        <au-grid class="chart-grid" :width-lg="chartItemWidth">
          <topn-bar title="APP版本平均响应时间倒序条形图" :data="OperatorsAvgResponseTime"/>
        </au-grid>
        <au-grid class="chart-grid" :width-lg="chartItemWidth">
          <topn-bar title="设备平均响应时间倒序条形图" :data="OperatorsAvgResponseTime"/>
        </au-grid>
        <au-grid class="chart-grid" :width-lg="chartItemWidth">
          <topn-bar title="操作系统平均响应时间倒序条形图" :data="OperatorsAvgResponseTime"/>
        </au-grid>
      </div>
    </au-scroller>
  </div>
</template>

<script>
  import chartLineBar from '_commons/charts/chart-line-bar'
  import topnBar from '_commons/charts/topn-bar'
  import store from '_store'
  export default {
    name: 'network-request',
    components: { chartLineBar, topnBar },
    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
      if (store.ready) this.getDomainList(store.getConditions())
      store.$on('ready', conditions => {
        this.getDomainList(conditions)
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
    },
    data () {
      return {
        sortKeys: ['响应时间', '吞吐率', '请求数'],
        currentSortKey: '响应时间',
        searchKey: '',
        domainList: [
          {
            name: 'test test test',
            requestRate: 12.5,
            unit: 'ms'
          }
        ],
        currentDomain: {},
        overviewItemWidth: 3,
        chartItemWidth: 6,
        responseTime: [
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
        ],
        responseTimeAndRequestTime: [
          {
            'name': '正常请求数',
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
            'name': 'HTTP错误次数',
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
            'name': '网络失败次数',
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
            'name': '平均响应时间',
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
        ],
        rtrtStructureMap: {
          '网络失败次数': {
            type: 'bar',
            stack: true
          },
          'HTTP错误次数': {
            type: 'bar',
            stack: true
          },
          '平均响应时间': {
            type: 'bar',
            stack: true
          }
        },
        OperatorsAvgResponseTime: {
          unit: {},
          list: [
            {value: 335, name: '直接访问', more: { 'more-1': 10 }},
            {value: 310, name: '邮件营销', more: { 'more-1': 10 }},
            {value: 234, name: '联盟广告', more: { 'more-1': 10 }},
            {value: 135, name: '视频广告', more: { 'more-1': 10 }},
            {value: 1548, name: '搜索引擎', more: { 'more-1': 10 }}
          ]
        }
      }
    },
    methods: {
      getDomainList (conditions) {
        let vm = this
        vm.api.getDomainList({
          data: {
            condition: {
              appId: '703810296748650496',
              // appId: conditions.app.id,
              // appVersion: conditions.version,
              appVersion: 'mockAppv1',
              granularity: conditions.granularity,
              // ...conditions.timespan,
              startTime: 1512316800000,
              endTime: 1514563200000,
              topN: 5
            }
          }
        }).then(res => {
          console.log(res)
          if (res && res.data) this.domainList = res.data
        })
      },
      pickSortKey (key) {
        this.currentSortKey = key
      },
      handleResize () {
        if (window.innerWidth < 1100) {
          this.overviewItemWidth = 12
          this.chartItemWidth = 12
        } else if (window.innerWidth < 1500) {
          this.overviewItemWidth = 6
          this.chartItemWidth = 12
        } else {
          this.overviewItemWidth = 3
          this.chartItemWidth = 6
        }
      },
      getBgWidth (domain) {
        let max = null
        switch (this.currentSortKey) {
          case '响应时间':
            max = Math.max(...this.domainList.map(d => parseFloat(d.responseTime)))
            return parseFloat(domain.responseTime) / max * 100 + '%'
          case '吞吐率':
            max = Math.max(...this.domainList.map(d => parseFloat(d.responseTime)))
            return parseFloat(domain.responseTime) / max * 100 + '%'
          case '请求数':
            max = Math.max(...this.domainList.map(d => parseFloat(d.requestTimes)))
            return parseFloat(domain.requestTimes) / max * 100 + '%'
        }
      },
      getListNum (domain) {
        switch (this.currentSortKey) {
          case '响应时间':
            return domain.responseTime
          case '吞吐率':
            return domain.responseTime
          case '请求数':
            return domain.requestTimes
        }
      }
    }
  }
</script>
