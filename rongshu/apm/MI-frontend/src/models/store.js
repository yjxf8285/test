import Vue from 'vue'

let store = new Vue({
  data: {
    done: {
      currentApplicationReady: false,
      currentVersionReady: false,
      currentIntervalReady: false
    },
    intervals: ['30m', '1h', '6h', '12h', '1d', '3d', '7d', '14d', '1M']
  },
  computed: {
    ready () {
      if (this.done.currentApplicationReady && this.done.currentVersionReady && this.done.currentIntervalReady) {
        this.notify('ready')
        return true
      } else {
        return false
      }
    }
  },
  methods: Object.assign({
    notify (eventName = 'change', value) {
      if (eventName === 'ready') {
      }
      this.$nextTick(() => this.$emit(eventName, value !== undefined ? value : this.getConditions()))
    },
    getConditions () {
      return {
        app: this.getCurrentApplication(),
        version: this.getCurrentVersion(),
        interval: this.getCurrentInterval(),
        timespan: getTimeSpanFromInterval(this),
        granularity: this.getCurrentGranularity()
      }
    },
    getCurrentTimeSpan () {
      return getTimeSpanFromInterval(this.getCurrentInterval())
    },
    getCurrentGranularity () {
      return getGranularityFromInterval(this.getCurrentInterval())
    }
  }, generateMethods([
    'applicationList',
    'currentApplication',
    'versionList',
    'currentVersion',
    'currentInterval'
  ]))
})

function setToLocalStoragy (name, item, context) {
  if (typeof item === 'object') { // include array
    let json = null
    try {
      json = JSON.stringify(item)
    } catch (e) {
      throw new Error(`store: can not set ${name} to sessionStorage as a json string`)
    }
    window.sessionStorage.setItem(name, json)
    window.sessionStorage.setItem(name + 'Type', 'map')
  } else if (typeof item === 'string') {
    window.sessionStorage.setItem(name, item)
    window.sessionStorage.setItem(name + 'Type', 'string')
  }
  if (context.done[name + 'Ready'] !== undefined && !context.done[name + 'Ready']) context.done[name + 'Ready'] = true
  // console.log(context.done[name + 'Ready'] !== undefined, !context.done[name + 'Ready'])
  window.sessionStorage.setItem(name + 'Timestamp', (new Date()).getTime())
  context.notify(name + 'Change', item)
  if (context.ready) context.notify('change')
}

function getFromLocalStoragre (name) {
  let type = window.sessionStorage.getItem(name + 'Type')
  let res
  if (type === 'map') {
    try {
      res = JSON.parse(window.sessionStorage.getItem(name))
    } catch (e) {
      console.warn(`store: can not get ${name} from sessionStorage`)
    }
    res._timestamp = window.sessionStorage.getItem(name + 'Timestamp')
  } else if (type === 'string') {
    res = window.sessionStorage.getItem(name)
  }
  return res
}

function generateMethods (nameList) {
  let methods = {}
  nameList.forEach(name => {
    methods['get' + name[0].toUpperCase() + name.slice(1)] = function () {
      return getFromLocalStoragre(name)
    }
    methods['set' + name[0].toUpperCase() + name.slice(1)] = function (item) {
      return setToLocalStoragy(name, item, store)
    }
  })
  return methods
}

function getTimeSpanFromInterval (interval) {
  let endTime = (new Date()).getTime()
  let index = store.intervals.indexOf(interval)
  interval = index !== -1 ? interval : store.intervals[0]

  let startTime = endTime - stringToMs(interval)
  return { startTime, endTime }
}

 /**
 * 时间字符串转毫秒
 */
function stringToMs (timeString) {
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
}

/**
 * 时间区间转颗粒度
 * @param interval
 * return ms
 * 规则 http://wiki.dataengine.com/pages/viewpage.action?pageId=15014245
 */
function getGranularityFromInterval (interval) {
  let resMs = 0
  let intervalMs = stringToMs(interval)
  // let t = intervalMs / 60000
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
    if (stringToMs(m.start) < intervalMs && intervalMs <= stringToMs(m.end)) {
      resMs = stringToMs(m.granularity)
    }
  })
  return resMs
}

if (!store.getCurrentInterval()) store.setCurrentInterval(store.intervals[0])

export default store
