<style lang="scss" scoped>
  @import '~vars';
  .single-error-snapshoot {
    height: 100%;
    padding-bottom: 100px;
    .panel {
      padding: 10px 0;
      border-style: solid;
      border-width: 1px;
      font-size: $normal;
    }
    .title {
      padding: 0 20px 10px 20px;
      border-bottom-style: solid;
      border-bottom-width: 1px;
      font-weight: bold;
    }
    .panel {
      margin: 10px 20px;
    }
    .basic-info {
      width: 100%;
      td {
        padding: 10px 0 0 20px;
        text-align: center;
      }
      td:last-child {
        padding-right: 20px;
      }
    }
    .line {
      height: 350px;
      margin: 10px 20px;
    }
    .pie-container {
      padding: 0 10px 0 20px;
    }
    .pie {
      padding: 0 10px 10px 0;
    }
    .toggle-icon {
      font-size: $normal;
      cursor: pointer;
    }
    .paginator {
      padding: 10px;
      text-align: center;
      font-weight: bold;
    }
    .trace-panel {
      margin-top: 0;
    }
    .trace-info {
      width: 100%;
      td {
        padding: 0 0 5px 20px;
      }
    }
    .info-container {
      padding: 20px 20px 0 20px;
      h4 {
        padding: 0 10px 5px 10px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        font-weight: bold;
      }
      p {
        padding: 5px 10px 0 10px;
      }
    }
    .stack-list {
      .stack-item {
        padding: 0 10px;
        line-height: 26px;
      }
    }

  }
</style>

<template>
  <au-scroller class="single-error-snapshoot au-theme-background-color--base-10 au-theme-font-color--base-3">
    <div class="panel au-theme-background-color--base-12 au-theme-border-color--base-8">
      <h3 class="title au-theme-border-color--base-8">v2/report</h3>
      <table class="basic-info">
        <tr>
          <td>错误信息</td>
          <td>最后一次</td>
          <td>同类错误</td>
          <td>影响设备数</td>
        </tr>
        <tr>
          <td>数据超长</td>
          <td>2017-11-10 10:39:31</td>
          <td>3</td>
          <td>3</td>
        </tr>
      </table>
    </div>
    <chart-line-bar class="line au-theme-background-color--base-12" type="line" :data="fakeData.data" title="错误数趋势(--fake--)"/>
    <div class="pie-container">
      <au-grid class="pie chart-grid" width-md="6" width-lg="4">
        <chart-pie class="au-theme-background-color--base-12" :data="fakePieData.data" title="操作系统"/>
      </au-grid>
      <au-grid class="pie chart-grid" width-md="6" width-lg="4">
        <chart-pie class="au-theme-background-color--base-12" :data="fakePieData.data" title="设备"/>
      </au-grid>
      <au-grid class="pie chart-grid" width-md="6" width-lg="4">
        <chart-pie class="au-theme-background-color--base-12" :data="fakePieData.data" title="应用版本"/>
      </au-grid>
      <au-grid class="pie chart-grid" width-md="6" width-lg="4">
        <chart-pie class="au-theme-background-color--base-12" :data="fakePieData.data" title="地域"/>
      </au-grid>
      <au-grid class="pie chart-grid" width-md="6" width-lg="4">
        <chart-pie class="au-theme-background-color--base-12" :data="fakePieData.data" title="运营商"/>
      </au-grid>
      <au-grid class="pie chart-grid" width-md="6" width-lg="4">
        <chart-pie class="au-theme-background-color--base-12" :data="fakePieData.data" title="接入方式"/>
      </au-grid>
    </div>
    <div class="panel trace-panel au-theme-background-color--base-12 au-theme-border-color--base-8">
      <h3 class="title au-theme-border-color--base-8">错误追踪</h3>
      <div class="paginator">
        <au-icon class="toggle-icon au-theme-hover-font-color--primary-3" type="angle-left"/>
        第 3 / 100 个同类错误
        <au-icon class="toggle-icon au-theme-hover-font-color--primary-3" type="angle-right"/>
      </div>
      <table class="trace-info">
        <tr>
          <td>APP版本: 1.2.8</td>
          <td>设备名称: iPhone X</td>
          <td>CPU使用率: 25.4%</td>
          <td>内存空闲: 60.8MB</td>
        </tr>
        <tr>
          <td>操作系统: iOS 9.3.1</td>
          <td>占用内存: 32.43MB</td>
          <td>屏幕朝向: 竖屏</td>
          <td>用户ID: 匿名 10336639383746574</td>
        </tr>
        <tr>
          <td>接入方式: 3G</td>
          <td>可用磁盘: 6.09GBB</td>
          <td>SDK版本: iOS 1.1</td>
          <td>用户IP: 001.002.003.004</td>
        </tr>
      </table>
      <div class="info-container">
        <h4 class="au-theme-border-color--base-8">完整URL</h4>
        <p>http://seagull.toushibao.com/app/request/detail/5756704860793511?uri=%2Fentry</p>
      </div>
      <div class="info-container">
        <h4 class="au-theme-border-color--base-8">POST参数</h4>
        <p>
          {
            "condition":
                {
                    "appId":"703810296748650496",
                    "appVersion":"mockAppv1",
                    "startTime":1512316800000,
                    "endTime":1514563200000,
                    "topN": 5
                }
            }
        </p>
      </div>
      <div class="info-container">
        <h4 class="au-theme-border-color--base-8" v-if="true">调用堆栈</h4>
        <ul class="stack-list">
          <li class="stack-item">0 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item au-theme-background-color--base-10">1 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item ">2 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item au-theme-background-color--base-10">3 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item ">4 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item au-theme-background-color--base-10">5 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item ">6 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
          <li class="stack-item au-theme-background-color--base-10">7 alkdfj a flk apsf ajdf apsf asf poasj poasj po</li>
        </ul>
      </div>
      <div class="info-container">
        <h4 class="au-theme-border-color--base-8">响应头</h4>
        <p>
          "key" : "value",
        </p>
        <p>
          "Content-Type" : "text\/html; charset=UTF-8",
        </p>
        <p>
          "Content-Length" : "26",
        </p>
        <p>
          "Date" : "Mon, 05 Jun 2017 07:00:36 GMT"
        </p>
      </div>
      <div class="info-container">
        <h4 class="au-theme-border-color--base-8">响应内容</h4>
        <p>
          {"key":"value"}
        </p>
      </div>
    </div>
  </au-scroller>
</template>
<script>
import ChartLineBar from '_commons/charts/chart-line-bar.vue'
import ChartPie from '_commons/charts/chart-pie.vue'

export default {
  name: 'single-error-snapshoot',
  components: { ChartLineBar, ChartPie },
  data () {
    return {
      fakeData: {
        code: 0,
        message: 'success',
        data: [
          {
            'name': '响应时间趋势图s',
            'list': [
              {
                'x': 1511783400000,
                'y': '12'
              },
              {
                'x': 1511784400000,
                'y': '36'
              },
              {
                'x': 1511785400000,
                'y': '14'
              },
              {
                'x': 1511786400000,
                'y': '27'
              },
              {
                'x': 1511787400000,
                'y': '9'
              },
              {
                'x': 1511788400000,
                'y': '17'
              }
            ]
          }
        ]
      },
      fakePieData: {
        code: 0,
        message: 'success',
        data: {
          list: [
            {value: 335, name: '直接访问'},
            {value: 310, name: '邮件营销'},
            {value: 234, name: '联盟广告'},
            {value: 135, name: '视频广告'},
            {value: 1548, name: '搜索引擎'}
          ],
          unit: '元'
        }
      }
    }
  }
}
</script>

