import util from '_util'

export default {
  data() {
    return {
      topBarQueryData: {}
    }
  },
  props: {},
  watch: {},
  computed: {
    appId() {
      return this.topBarQueryData.system.id
    },
    startTime() {
      return Number(this.topBarQueryData.time.startTime)
    },
    endTime() {
      return util.cutEndTime(Number(this.topBarQueryData.time.endTime)) // 后端入参需要减掉3分钟
    },
    aggrInterval() {
      return util.intervalToGranularity(this.endTime - this.startTime)
    },
    interval() {
      return ''
    }
  },
  methods: {}
}
