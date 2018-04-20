export default {
  data() {
    return {
      needReload: true
    }
  },
  props: {
    options: {
      type: Object,
      default: {}
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    options: {
      deep: true,
      handler(v) {
        console.log(v)
        this.needReload = true
        if (this.selected) {
          this._reload()
        }
      }
    },
    selected(v) {
      // console.log('Tab选中状态：' + v)
      if (v) {
        this._reload()
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
