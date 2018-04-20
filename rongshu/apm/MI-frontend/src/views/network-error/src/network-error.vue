    <!-- <router-link target="_blank" :to="{path: 'network-error/single-error-snapshoot'}">go to single network error snapshoot</router-link> -->
<style lang="scss" scoped>
  @import '~vars';
  .network-error {
    height: 100%;
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
      padding-right: 40px;
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
    padding: 10px;
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
      padding-right: 20px;
    }
    .chart-grid {
      padding: 0 0 10px 10px;
    }
    .table-container {
      padding: 0 20px 20px 10px;
      .table-container-inner {
        border-width: 1px;
        border-style: solid;
      }
      h3 {
        padding: 10px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        font-size: $normal;
        font-weight: bold;
      }
      .table-holder {
        padding: 10px;
      }
      .paginator-holder {
        padding: 10px;
        text-align: right;
      }
    }
  }
</style>
<template>
  <div class="network-error au-theme-font-color--base-3">
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
          <li class="
            item
            au-theme-border-color--primary-5
            au-theme-hover-font-color--primary-3
            au-theme-hover-border-color--primary-3">
            <span class="rate-bg au-theme-background-color--danger-5" :style="{ width: '75%' }"></span>
            <span class="item-text">api.mobileapm.com.api.mobileapm.com.api.mobileapm.com.api.mobileapm.com</span>
            <span class="item-num">75%</span>
          </li>
          <li class="
            item
            au-theme-border-color--primary-5
            au-theme-hover-font-color--primary-3
            au-theme-hover-border-color--primary-3">
            <span class="rate-bg au-theme-background-color--danger-5" :style="{ width: '45%' }"></span>
            <span class="item-text">api.mobileapm.com.api.mobileapm.com.api.mobileapm.com.api.mobileapm.com</span>
            <span class="item-num">45%</span>
          </li>
          <li class="
            item
            au-theme-border-color--primary-5
            au-theme-hover-font-color--primary-3
            au-theme-hover-border-color--primary-3">
            <span class="rate-bg au-theme-background-color--danger-5" :style="{ width: '35%' }"></span>
            <span class="item-text">api.mobileapm.com.api.mobileapm.com.api.mobileapm.com.api.mobileapm.com</span>
            <span class="item-num">35%</span>
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
          <chart-line-bar title="TOP5域名 HTTP错误率趋势图" :data="responseTime"/>
        </au-grid>
        <au-grid class="chart-grid" width-lg="12">
          <chart-line-bar title="TOP5域名 网络失败率趋势图" :data="responseTime"/>
        </au-grid>
      </div>
      <div class="table-container">
        <div class="table-container-inner au-theme-border-color--base-8">
          <h3 class="au-theme-border-color--base-8">错误快照</h3>
          <div class="table-holder">
            <au-table>
              <thead>
                <tr>
                  <th>请求</th>
                  <th>错误信息</th>
                  <th>第一次发生时间</th>
                  <th>近一次发生时间</th>
                  <th>错误次数</th>
                  <th>错误率</th>
                  <th>影响用户数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/mobile-apm/api/test</td>
                  <td>ajax error</td>
                  <td>2017-12-01 11:00:21</td>
                  <td>2017-12-01 11:00:21</td>
                  <td>20</td>
                  <td>35%</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>/mobile-apm/api/test</td>
                  <td>ajax error</td>
                  <td>2017-12-01 11:00:21</td>
                  <td>2017-12-01 11:00:21</td>
                  <td>20</td>
                  <td>35%</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>/mobile-apm/api/test</td>
                  <td>ajax error</td>
                  <td>2017-12-01 11:00:21</td>
                  <td>2017-12-01 11:00:21</td>
                  <td>20</td>
                  <td>35%</td>
                  <td>5</td>
                </tr>
              </tbody>
            </au-table>
          </div>
          <div class="paginator-holder">
            <au-paginator class="paginator" :total="100" :size="20" :current="1"></au-paginator>
          </div>
        </div>
      </div>
    </au-scroller>
  </div>
</template>

<script>
  import chartLineBar from '_commons/charts/chart-line-bar'
  import topnBar from '_commons/charts/topn-bar'
  export default {
    name: 'network-error',
    components: { chartLineBar, topnBar },
    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
    },
    data () {
      return {
        sortKeys: ['响应时间', '吞吐率', '请求数'],
        currentSortKey: '响应时间',
        searchKey: '',
        currentRequest: {},
        overviewItemWidth: 3,
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
                'y': '1.2'
              },
              {
                'x': 1511784400000,
                'y': '1.4'
              },
              {
                'x': 1511785400000,
                'y': '1.7'
              },
              {
                'x': 1511786400000,
                'y': '0.9'
              },
              {
                'x': 1511787400000,
                'y': '1.8'
              },
              {
                'x': 1511788400000,
                'y': '2.9'
              }
            ]
          }
        ]
      }
    },
    methods: {
      pickSortKey (key) {
        this.currentSortKey = key
      },
      handleResize () {
        if (window.innerWidth < 1100) {
          this.overviewItemWidth = 12
        } else if (window.innerWidth < 1500) {
          this.overviewItemWidth = 6
        } else {
          this.overviewItemWidth = 3
        }
      }
    }
  }
</script>
