<style  lang="scss" scoped>
.top-bar {
  height: 33px;
  .left {
    float: left;
    height: 33px;
    line-height: 33px;
  }
  .right {
    // overflow-x: hidden;
    // overflow-y: visible;
    text-align: right;
  }
  .refresh-btn,
  .auto-refresh-select,
  .rangepicker {
    vertical-align: middle;
  }
}
</style>

<template>
<div class="top-bar">
  <au-breadcrumb
    class="left"
    :crumbs="crumbs"
    v-if="showBreadcrumbs"
    v-show="crumbs.length"
    @select="handleCrumbSelect"/>
  <div class="right">
    <au-button plain>
      <au-icon type="refresh" class="refresh-btn" @click="refresh"></au-icon>
    </au-button>
    <au-select class="auto-refresh-select" v-model="autoRefreshInterval" :options="autoRefreshOptions"></au-select>
    <au-rangepicker
    class="rangepicker"
      ref="rangePicker"
      v-model="range"
      start="1018-2-5 12:12:12"
      end="2118-3-2 12:12:33"
      span="539200000"
      type="all"
      :relative="true"
      :absolute="true"
      size="normal"
      :disabled="false"/>
  </div>
</div>
</template>

<script>
import common from '_common'
import store from '_store'
let timer
export default {
  name: 'defaultToolbar',
  data () {
    return {
      startTime: '',
      endTime: '',
      aggrInterval: '',
      autoRefreshInterval: 999,
      autoRefreshOptions: [
        {
          text: '关闭自动刷新',
          value: 999
        },
        {
          text: '每30秒刷新',
          value: 30000
        },
        {
          text: '每1分钟刷新',
          value: 60000
        },
        {
          text: '每2分钟刷新',
          value: 120000
        },
        {
          text: '每5分钟刷新',
          value: 300000
        }
      ],
      range: {
        startDate: '2018-01-01',
        startTime: '01:01:10',
        endDate: '2018-01-01',
        endTime: '12:12:12'
      },
      crumbs: []
    }
  },
  props: {
    showBreadcrumbs: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    range (v) {
      this.setStore()
    },
    autoFreshInterval (newVal) {
      let that = this
      window.clearInterval(timer)
      if (newVal !== 999) {
        timer = window.setInterval(() => {
          that.refresh()
        }, this.autoRefreshInterval)
      } else {
        window.clearInterval(timer)
      }
      window.sessionStorage.setItem('autoRefreshInterval', newVal)
    },
    $route (v) {
      this.crumbs = this.$router.getBreadcrumbs()
    }
  },
  mounted () {
    this.getDefaultTime()
    this.setStore()
    this.crumbs = this.$router.getBreadcrumbs()
    // console.log(this.crumbs)
  },
  methods: {
    /**
     * 转换对应格式的startTime,endTime,aggrInterval，将这些参数存储到Store中
     */
    setStore () {
      let localRange = this.range
      let startTime = Number(new Date(`${localRange.startDate} ${localRange.startTime}`))
      let endTime = Number(new Date(`${localRange.endDate} ${localRange.endTime}`))
      let aggrInterval = this.intervalToGranularity(endTime - startTime)
      store.set(common.storeKeys.selectedOriginTimeRange, localRange)
      store.set(common.storeKeys.selectedTimeRange, {
        startTime,
        endTime,
        aggrInterval
      })
    },
    getDefaultTime () {
      let currentTime = store.get(common.storeKeys.selectedOriginTimeRange)
      if (currentTime) {
        this.range = currentTime
      }
      this.autoRefreshInterval = window.sessionStorage.getItem('autoRefreshInterval') || 999
    },
    refresh () {
      // console.log('refresh')
      this.setStore()
    },
    /**
     * 时间区间转颗粒度
     * @param interval (30m 1h 7d)
     * return ms
     * 规则 http://wiki.dataengine.com/pages/viewpage.action?pageId=15014245
     */
    intervalToGranularity (interval) {
      let resMs = 0
      let intervalMs = interval // 直接传毫秒进来，不用转了
      let rules = [
        {
          start: '1m',
          end: '60m',
          granularity: '1m'
        },
        {
          start: '60m',
          end: '2h',
          granularity: '2m'
        },
        {
          start: '2h',
          end: '5h',
          granularity: '5m'
        },
        {
          start: '5h',
          end: '10h',
          granularity: '10m'
        },
        {
          start: '10h',
          end: '15h',
          granularity: '15m'
        },
        {
          start: '15h',
          end: '30h',
          granularity: '30m'
        },
        {
          start: '30h',
          end: '60h',
          granularity: '1h'
        },
        {
          start: '60h',
          end: '120h',
          granularity: '2h'
        },
        {
          start: '120h',
          end: '180h',
          granularity: '3h'
        },
        {
          start: '180h',
          end: '240h',
          granularity: '4h'
        },
        {
          start: '240h',
          end: '360h',
          granularity: '6h'
        },
        {
          start: '360h',
          end: '600h',
          granularity: '10h'
        },
        {
          start: '600h',
          end: '720h',
          granularity: '12h'
        }
      ]
      rules.forEach(m => {
        if (this.stringToMs(m.start) < intervalMs && intervalMs <= this.stringToMs(m.end)) {
          resMs = this.stringToMs(m.granularity)
        }
      })
      return resMs
    },
    /**
     * 时间字符串转毫秒
     * @param timeString (1M,12h)
     * @returns timestamp
     */
    stringToMs (timeString) {
      let numExp = /\d+/g
      let unitExp = /[a-zA-Z]+/g
      let num = timeString.match(numExp)[0]
      let timeType = timeString.match(unitExp)[0]
      let enumeration = {
        m: 60000,
        h: 3600000,
        d: 86400000,
        w: 604800000,
        M: 2592000000
      }
      let res = num * enumeration[timeType]
      return res
    },
    handleCrumbSelect (crumb) {
      this.$router.push({name: crumb.url})
    }
  }
}
</script>
