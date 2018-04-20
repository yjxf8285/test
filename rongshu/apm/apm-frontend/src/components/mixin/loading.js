import {
  Loading
} from 'element-ui'
export default {
  data() {
    return {
      loading: false,
      loadingInstance: null
    }
  },
  mounted() {
    if (!this.$refs.loadingContainer) {
      console.warn('你使用了loadingMixin，但没有指定ref=loadingContainer的DOM节点，系统会自动在body上启用加载效果', this)
    }
  },
  watch: {
    loading(v) {
      if (v) {
        this.loadingInstance = Loading.service({
          target: this.$refs.loadingContainer
        })
      } else {
        if (this.loadingInstance) {
          this.loadingInstance.close()
          this.loadingInstance = null
        }
      }
    }
  }
}
