export default {
  data() {
    return {
      needReload: false
    }
  },
  props: {
    condition: Object,
    selected: Boolean
  },
  watch: {
    condition: {
      deep: true,
      handler(v) {
        this.needReload = true
        if (this.selected) {
          this._reload()
        }
      }
    },
    selected: {
      deep: true,
      handler(v) {
        if (v) {
          this._reload()
        }
      }
    }
  },
  methods: {
    _reload() {
      if (this.needReload) {
        this.reload()
        this.needReload = false
      }
    }
  }
}
