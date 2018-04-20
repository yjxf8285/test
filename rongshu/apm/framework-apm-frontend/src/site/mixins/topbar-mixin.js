
import store from '_store'
import common from '_common'
export default {
  data () {
    return {
      topBarQueryData: {
        appId: '',
        aggrInterval: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted: function () {
    store.$on('change', this.onApplicationConditionChanged)
  },
  destroyed () {
    store.$off('change', this.onApplicationConditionChanged)
  },
  methods: {
    onApplicationConditionChanged (appCondition) {
      this.topBarQueryData = {
        appId: appCondition[common.storeKeys.selectedApplication].system_config_id,
        startTime: appCondition[common.storeKeys.selectedTimeRange].startTime,
        endTime: appCondition[common.storeKeys.selectedTimeRange].endTime,
        aggrInterval: appCondition[common.storeKeys.selectedTimeRange].aggrInterval
      }
      console.log('onApplicationConditionChanged')
      console.log(this.topBarQueryData)
    }
  }
}
