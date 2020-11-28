import posQuery from './pos-query/pos-query.vue'
import changeConfig from './change-config/change-config.vue'
import inStore from './in-store/in-store.vue'
import activateChange from './activate-change/activate-change.vue'
export default {
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      window.console.log(tab, event)
    }
  },
  components: {
    posQuery,
    changeConfig,
    inStore,
    activateChange
  }
}
